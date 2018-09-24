import { WebAuth, AuthOptions, CrossOriginLoginOptions, Auth0Error, ParseHashOptions, Auth0DecodedHash, LogoutOptions } from "auth0-js";
import StorageService from "./storageService";
import * as jwtDecode from "jwt-decode";
import ApiService from "./apiService";

export interface IAuthService {
    login(email: string, password: string, redirectUri: string, callback: (error: Auth0Error) => void): void;
    logout(): void;
}

export interface IDecodedToken {
    app_metadata: IAppMetadata;
    picture: string;
}

export interface IAppMetadata {
    username: string;
    roles: string[];
}

/// https://auth0.com/docs/cross-origin-authentication
export class AuthService implements IAuthService {
    auth: WebAuth;
    storage: StorageService;
    constructor() {
        let options: AuthOptions = {
          clientID: appConfig.auth0_clientId,
          domain: appConfig.auth0_domain,
          redirectUri: appConfig.auth0_callbackUrl,
          scope: "openid email user_metadata app_metadata picture",
          responseType: "token"
        };
        this.auth = new WebAuth(options)
        //this.auth.crossOriginAuthenticationCallback();

        this.storage = new StorageService();
    }

    login(email: string, password: string, redirectUri: string, callback: (error: Auth0Error) => void) {
      let loginOptions : CrossOriginLoginOptions = {
        email,
        password,
        realm: "Username-Password-Authentication",
        // TODO: Auth0 cross origin login doesn't appear to support state anymore? (CSRF & return urls?) https://auth0.com/docs/protocols/oauth2/oauth-state
        //state: redirectUri
      };

      this.auth.login(
        loginOptions,
        (error: Auth0Error, result: any) => {
           callback(error);
         });
    }

    parseHash(hash: string) {
        let parseOptions: ParseHashOptions = {
            hash
        };
        this.auth.parseHash(parseOptions, (error: Auth0Error, result: Auth0DecodedHash) => {
            if(error) {
                console.log("Encountered error parsing authentication hash");
                console.log(error);
                // TODO: redirect to error page?
                return;
            }
            this.saveToken(result).then(() => {
                window.location.replace('/');
            }); 
        });
      }
  
      saveToken(authResult: Auth0DecodedHash) {
        if (authResult && authResult.idToken) {
          let decoded: IDecodedToken = jwtDecode(authResult.idToken);
          let username = decoded.app_metadata.username;
          let role = decoded.app_metadata.roles[0];
          let avatar = decoded.picture;
  
          console.log("Saving valid auth token for " + username)
          this.storage.saveInfo(authResult.idToken, username, avatar, role);

          return ApiService.reportLogin().then(function (response) {
            if (response.status === 200) {
              console.log("Successfully reported login");
            }
            else {
              console.log(`Error: Received HTTP Status code ${response.status} when attempting to report login`);
            }
          });
        }
        else {
            return Promise.reject("AuthResult was null or no idtoken was provided");
        }
      }

    isLoggedIn() {
        return !!this.storage.getToken();
    }

    logout() {
        var logoutOptions: LogoutOptions = {
            clientID: appConfig.auth0_clientId,
            returnTo: appConfig.auth0_logoutCallbackUrl
        };
        this.auth.logout(logoutOptions);
    }
    
    clearSession() {
        this.storage.clear();        
    }
}

let authService = new AuthService();
export default authService;