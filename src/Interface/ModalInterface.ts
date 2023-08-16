export type ModalViewTypes = "login" | "signup" | "resetPassword" | null;

export interface ModalInterface {
    isOpen: boolean;
    view: ModalViewTypes;
}

export const defaultModalState: ModalInterface = {
    isOpen: false,
    view: null
}