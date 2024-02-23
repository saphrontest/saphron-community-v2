export type UserRoleTypes =  'admin' | 'user' | ''
export interface IUser {
    id: string;
    displayName: string;
    email: string;
    username: string;
    emailVerified: boolean;
    isRegistered: boolean;
    provider: string | null;
    coverPhotoURL: string;
    profilePhotoURL: string;
    phoneNumber: string;
    role: UserRoleTypes;
}

export const defaultUserState: IUser = {
    id: "",
    displayName: "",
    email: "",
    emailVerified: false,
    username: "",
    isRegistered: false,
    provider: null,
    coverPhotoURL: "",
    profilePhotoURL: "",
    phoneNumber: "",
    role: "",
}