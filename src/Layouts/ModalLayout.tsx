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
  size?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isCentered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  children: React.ReactElement[] | React.ReactElement
};

const ModalLayout: React.FC<ModalLayoutProps> = ({
  isOpen,
  onClose,
  children,
  size='lg',
  isCentered=true,
  scrollBehavior = 'inside'
}) => {
  const dispatch = useDispatch()
  const modal = useSelector((state: RootState) => state.modal)
  return (
    <Modal
    size={size}
    isCentered={isCentered}
    scrollBehavior={scrollBehavior}
    isOpen={isOpen ?? modal.isOpen}
    onClose={() => onClose ? onClose() : dispatch(setModal({isOpen: false, view: null}))}
    >
      <ModalOverlay />
      <ModalContent width={{ base: "sm", md: "xl" }}>{children}</ModalContent>
    </Modal>
  );
};
export default ModalLayout;
