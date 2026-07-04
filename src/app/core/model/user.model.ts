export enum UserRole {
    Admin = 'admin',
    User = 'user',
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    hasVoted: boolean;
}
