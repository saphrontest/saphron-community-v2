import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";
import React, { FC } from "react";

const BlockUserAlert: FC<{
    username: string;
    onClose: () => void;
    isOpen: boolean;
    confirmAction: () => void;
}> = ({
    username, onClose, isOpen, confirmAction
}) => {

    const cancelRef = React.useRef(null)

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Block {username}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure that you want to block {username}?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button bg="white" color="blue.500" border="1px solid" borderColor="blue.500" _hover={{color: 'white', background: 'blue.500'}} onClick={() => {
                            onClose()
                            confirmAction()
                        }} ml={3}
                        >
                            Block
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default BlockUserAlert