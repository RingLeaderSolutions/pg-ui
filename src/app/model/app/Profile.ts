export interface Profile {
    userId: string;
    email: string;
    roles: string[];
    picture: string;
    isVerified: boolean;
    lastPasswordReset: Date;
}