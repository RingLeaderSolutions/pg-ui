import * as Auth0 from "auth0-js";
import { Profile } from "../model/app/Profile";

export class LocalStorageRepository {
    public saveProfile(auth0Profile: Auth0.Auth0UserProfile): void {
        let roles = auth0Profile.app_metadata && auth0Profile.app_metadata.roles;

        localStorage.setItem(PersistedDataKeys.UserId, auth0Profile.user_id);
        localStorage.setItem(PersistedDataKeys.FirstName, auth0Profile.given_name);
        localStorage.setItem(PersistedDataKeys.LastName, auth0Profile.family_name);
        localStorage.setItem(PersistedDataKeys.Email, auth0Profile.email);
        localStorage.setItem(PersistedDataKeys.Roles, JSON.stringify(roles));
        localStorage.setItem(PersistedDataKeys.LastPasswordReset, auth0Profile.last_password_reset || '');
        localStorage.setItem(PersistedDataKeys.Picture, auth0Profile.picture);
        localStorage.setItem(PersistedDataKeys.IsVerified, String(auth0Profile.email_verified));
    }

    public saveTokens(idToken: string, accessToken: string, refreshToken: string): void {
        localStorage.setItem(PersistedDataKeys.IdToken, idToken || '');
        localStorage.setItem(PersistedDataKeys.AccessToken, accessToken || '');
        localStorage.setItem(PersistedDataKeys.RefreshToken, refreshToken || '');
    }

    public fetchProfile(): Profile {
        let lastPasswordReset = localStorage.getItem(PersistedDataKeys.LastPasswordReset);
        let isVerified = localStorage.getItem(PersistedDataKeys.IsVerified);
        let roles = localStorage.getItem(PersistedDataKeys.Roles);

        return {
            userId: localStorage.getItem(PersistedDataKeys.UserId),
            firstName: localStorage.getItem(PersistedDataKeys.FirstName),
            lastName: localStorage.getItem(PersistedDataKeys.LastName),
            email: localStorage.getItem(PersistedDataKeys.Email),
            roles: JSON.parse(roles),
            lastPasswordReset: new Date(lastPasswordReset),
            picture: localStorage.getItem(PersistedDataKeys.Picture),
            isVerified: Boolean(isVerified)
        };
    }

    public fetchIdToken(): string {
        return localStorage.getItem(PersistedDataKeys.IdToken);
    }

    public fetchAccessToken(): string{
        return localStorage.getItem(PersistedDataKeys.AccessToken);
    }

    fetchRefreshToken(): string {
        return localStorage.getItem(PersistedDataKeys.RefreshToken);
    }

    public clearTokens(){
        localStorage.removeItem(PersistedDataKeys.IdToken);
        localStorage.removeItem(PersistedDataKeys.AccessToken);
    }

    public clearProfile(){
        localStorage.removeItem(PersistedDataKeys.UserId);
        localStorage.removeItem(PersistedDataKeys.Email);
        localStorage.removeItem(PersistedDataKeys.Roles);
        localStorage.removeItem(PersistedDataKeys.Picture);
        localStorage.removeItem(PersistedDataKeys.IsVerified);
        localStorage.removeItem(PersistedDataKeys.LastPasswordReset);
    }
}

class PersistedDataKeys {
    public static readonly Namespace = "tpiflow";

    public static readonly TokenSection = `${PersistedDataKeys.Namespace}.tokens`;
    public static readonly IdToken = `${PersistedDataKeys.TokenSection}.id_token`;
    public static readonly AccessToken = `${PersistedDataKeys.TokenSection}.access_token`;
    public static readonly RefreshToken = `${PersistedDataKeys.TokenSection}.refresh_token`;

    public static readonly ProfileSection = `${PersistedDataKeys.Namespace}.profile`;
    public static readonly UserId = `${PersistedDataKeys.ProfileSection}.id`;
    public static readonly FirstName = `${PersistedDataKeys.ProfileSection}.firstName`;
    public static readonly LastName = `${PersistedDataKeys.ProfileSection}.lastName`;
    public static readonly Email = `${PersistedDataKeys.ProfileSection}.email`;
    public static readonly Roles = `${PersistedDataKeys.ProfileSection}.roles`;
    public static readonly Picture = `${PersistedDataKeys.ProfileSection}.picture`;
    public static readonly IsVerified = `${PersistedDataKeys.ProfileSection}.isVerified`;
    public static readonly LastPasswordReset = `${PersistedDataKeys.ProfileSection}.lastPasswordReset`;
}