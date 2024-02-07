export type ModalViewTypes = "login" | "signup" | "resetPassword" | "addCommunity" | "editProfile" | "createWorkshop" | "joinWorkshop" | null;

export interface ModalInterface {
    isOpen: boolean;
    view: ModalViewTypes;
    data?: any;
}

export const defaultModalState: ModalInterface = {
    isOpen: false,
    view: null,
    data: null
}