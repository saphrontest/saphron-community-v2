import { ISubscription } from "./PaymentInterface";

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
    subscriptions?: ISubscription[]
    role: UserRoleTypes;
}

export interface IBlockedUser {
    id: string;
    date: string;
    userId: string;
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