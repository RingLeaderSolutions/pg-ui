export interface Profile {
    userId: string;
    email: string;
    role: string;
    picture: string;
    isVerified: boolean;
    lastPasswordReset: Date;
}