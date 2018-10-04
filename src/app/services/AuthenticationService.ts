import * as Auth0 from "auth0-js";
import { ILogger, PrefixedConsoleLogger, LogLevel } from "./Logger";
import { LocalStorageRepository } from "./LocalStorageRepository";
import { Arg } from "../helpers/Utils";

/* Service used to handle authenticating with Auth0 over the cross-origin authorization flow */
export class AuthenticationService {
    private readonly realm: string = "Username-Password-Authentication";
    
    private readonly logger: ILogger = new PrefixedConsoleLogger(LogLevel.Information, 'AuthenticationService');
    private readonly storage: LocalStorageRepository = new LocalStorageRepository();

    private readonly webAuth: Auth0.WebAuth;
    
    constructor(){
        // TODO: Enhance this option set to provide additional API-related `scope`s, and 
        // an `audience` set to the name of the Auth0 API.
        let authOptions: Auth0.AuthOptions = {
            clientID: appConfig.auth0_clientId,
            domain: appConfig.auth0_domain,
            redirectUri: appConfig.auth0_callbackUrl,
            scope: "openid email app_metadata",
            responseType: "token id_token"
          };
          
          this.webAuth = new Auth0.WebAuth(authOptions);
    }

    /* Logs the user in using the provided credentials, redirecting to Auth0 in the process. */
    public async login(email: string, password: string, intendedPath?: string): Promise<void>{
        Arg.isRequiredNotEmpty(email, "email");
        Arg.isRequiredNotEmpty(password, "password");

        let preservedState: PreservedApplicationState = { intendedPath };
        let loginOptions : Auth0.CrossOriginLoginOptions = {
            email,
            password,
            realm: this.realm,
            appState: JSON.stringify(preservedState),
          };

        this.logger.info(`Handing off user to Auth0 for cross-origin login request.`);

        return new Promise<void>((resolve, reject) => {
            // This promise never resolves because a successful call to the below method never
            // returns any data - it results in a hard redirect to Auth0
            this.webAuth.login(loginOptions, (error: Auth0.Auth0Error) => {
                if (error) {
                    this.logger.error(`Received error when attempting to log in: [${error.code} - ${error.description}]`);
                    reject(new LoginError(error.code, error.description));
                }
            });
        })
    }

    /* Parses the hash (e.g. "/login_complete#token=..."), from Auth0, validates it, and stores the id_token and key user profile information.*/
    public async parseRedirectHash(hash: string) : Promise<PreservedApplicationState> {
        Arg.isRequiredNotEmpty(hash, "hash");

        let parseOptions: Auth0.ParseHashOptions = { hash };

        return new Promise<PreservedApplicationState>((resolve, reject) => {
            this.webAuth.parseHash(parseOptions, (error: Auth0.Auth0Error, decodedHash: Auth0.Auth0DecodedHash) => {
                if(error){
                    this.logger.error(`Error parsing hash from Auth0: [${error.error}: ${error.errorDescription}]`);
                    throw new TokenError(error.error)
                }

                this.logger.info(`Successfully validated tokens and retrieved user profile.`);
                
                let profile = decodedHash.idTokenPayload as Auth0.Auth0UserProfile;
                this.storage.saveProfile(profile);

                let { idToken, accessToken, refreshToken } = decodedHash;
                this.storage.saveTokens(idToken, accessToken, refreshToken);
                
                let parsedAppState = JSON.parse(decodedHash.appState);
                
                // Retrieve the preserved application state from the decoded hash
                let preservedState = parsedAppState as PreservedApplicationState;
                resolve(preservedState);
            });
        })
    }

    /* Logs out the user by redirecting to the Auth0 logout URL. */
    public logout(): void {
        this.logger.info(`User initiated log out, clearing stored tokens & redirecting to Auth0...`);
        this.storage.clearTokens();

        var logoutOptions: Auth0.LogoutOptions = {
            clientID: appConfig.auth0_clientId,
            returnTo: appConfig.auth0_logoutCallbackUrl
        };
        this.webAuth.logout(logoutOptions);
    }
}

interface PreservedApplicationState {
    intendedPath?: string;
}

/* Generic authentication related error */
export class AuthenticationError extends Error {
    // tslint:disable-next-line:variable-name
    private __proto__: Error;
    
    constructor(message: string){
        const trueProto = new.target.prototype;
        super(message);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}

/*  
Catch all error for errors when logging a user in.
Known Auth0 error types: 
    [access_denied]
    [invalid_request]
    [unauthorized_client]
    [unsupported_credential_type]
    [password_leaked]
    [blocked_user]
    [too_many_attempts]
*/
class LoginError extends AuthenticationError {
    public errorType: string;

    constructor(errorType: string, message: string){
        super(message);
        this.errorType = errorType;
    }
}

/* Error thrown when an error occurs parsing the Auth0 provided token */
class TokenError extends AuthenticationError {
    constructor(message: string){
        super(message);
    }
}

export default new AuthenticationService();