import {
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../redux/slices/modalSlice";
import { RootState } from "../redux/store";

type ModalLayoutProps = {
  children: React.ReactElement[] | React.ReactElement
  isOpen?: boolean;
  onClose?: () => void;
  size?: string;
  isCentered?: boolean;
};

const ModalLayout: React.FC<ModalLayoutProps> = ({
  isOpen,
  children,
  size='lg',
  isCentered=true,
  onClose
}) => {
  const dispatch = useDispatch()
  const modal = useSelector((state: RootState) => state.modal)
  
  return (
    <>
      <Modal
      size={size}
      scrollBehavior="inside"
      isCentered={isCentered}
      isOpen={isOpen ?? modal.isOpen}
      onClose={() => onClose ? onClose() : dispatch(setModal({isOpen: false, view: null}))}
      >
        <ModalOverlay />
        <ModalContent width={{ base: "sm", md: "xl" }}>{children}</ModalContent>
      </Modal>
    </>
  );
};
export default ModalLayout;
