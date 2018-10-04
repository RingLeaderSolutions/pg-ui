import * as Auth0 from "auth0-js";
import { Profile } from "../model/app/Profile";

export class LocalStorageRepository {
    public saveProfile(auth0Profile: Auth0.Auth0UserProfile): void {
        let role = auth0Profile.app_metadata && auth0Profile.app_metadata.role;

        localStorage.setItem(PersistedDataKeys.UserId, auth0Profile.user_id);
        localStorage.setItem(PersistedDataKeys.Email, auth0Profile.email);
        localStorage.setItem(PersistedDataKeys.Role, role);
        localStorage.setItem(PersistedDataKeys.LastPasswordReset, auth0Profile.last_password_reset);
        localStorage.setItem(PersistedDataKeys.Picture, auth0Profile.picture);
        localStorage.setItem(PersistedDataKeys.IsVerified, String(auth0Profile.email_verified));
    }

    public saveTokens(idToken: string, accessToken: string, refreshToken: string): void {
        localStorage.setItem(PersistedDataKeys.IdToken, idToken);
        localStorage.setItem(PersistedDataKeys.AccessToken, accessToken);
        localStorage.setItem(PersistedDataKeys.RefreshToken, refreshToken);
    }

    public fetchProfile(): Profile {
        let lastPasswordReset = localStorage.getItem(PersistedDataKeys.LastPasswordReset);
        let isVerified = localStorage.getItem(PersistedDataKeys.IsVerified);
        
        return {
            userId: localStorage.getItem(PersistedDataKeys.UserId),
            email: localStorage.getItem(PersistedDataKeys.Email),
            role: localStorage.getItem(PersistedDataKeys.Role),
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

    public clearTokens(){
        localStorage.removeItem(PersistedDataKeys.IdToken);
        localStorage.removeItem(PersistedDataKeys.AccessToken);
    }

    public clearProfile(){
        localStorage.removeItem(PersistedDataKeys.UserId);
        localStorage.removeItem(PersistedDataKeys.Email);
        localStorage.removeItem(PersistedDataKeys.Role);
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
    public static readonly Email = `${PersistedDataKeys.ProfileSection}.email`;
    public static readonly Role = `${PersistedDataKeys.ProfileSection}.role`;
    public static readonly Picture = `${PersistedDataKeys.ProfileSection}.picture`;
    public static readonly IsVerified = `${PersistedDataKeys.ProfileSection}.isVerified`;
    public static readonly LastPasswordReset = `${PersistedDataKeys.ProfileSection}.lastPasswordReset`;
}