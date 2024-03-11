export type ModalViewTypes =
  | "login"
  | "signup"
  | "resetPassword"
  | "addCommunity"
  | "editProfile"
  | "createWorkshop"
  | "joinWorkshop"
  | "createSupportGroup"
  | "joinSupportGroup"
  | "editSupportGroup"
  | "paymentModal"
  | null;

export interface ModalInterface {
  isOpen: boolean;
  view: ModalViewTypes;
  data?: any;
}

export const defaultModalState: ModalInterface = {
  isOpen: false,
  view: null,
  data: null,
};
