export interface Profile {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    picture: string;
    isVerified: boolean;
    lastPasswordReset: Date;
}