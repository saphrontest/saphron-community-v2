export type ModalViewTypes = "login" | "signup" | "resetPassword" | "addCommunity" | "editProfile" | null;

export interface ModalInterface {
    isOpen: boolean;
    view: ModalViewTypes;
}

export const defaultModalState: ModalInterface = {
    isOpen: false,
    view: null
}