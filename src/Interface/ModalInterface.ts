export type ModalViewTypes = "login" | "signup" | "resetPassword" | "addCommunity" | null;

export interface ModalInterface {
    isOpen: boolean;
    view: ModalViewTypes;
}

export const defaultModalState: ModalInterface = {
    isOpen: false,
    view: null
}