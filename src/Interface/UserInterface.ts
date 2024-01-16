export interface UserInterface {
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
}

export const defaultUserState: UserInterface = {
    id: "",
    displayName: "",
    email: "",
    emailVerified: false,
    username: "",
    isRegistered: false,
    provider: null,
    coverPhotoURL: "",
    profilePhotoURL: "",
    phoneNumber: ""
}