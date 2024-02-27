import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text } from '@chakra-ui/react'
import React, { FC, useRef } from 'react'

const DeleteAlert: FC<{
    isOpen: boolean;
    toggleDialog: () => void;
    handleDelete: () => void;
    label: string;
}> = ({
    isOpen, toggleDialog, handleDelete, label
}) => {
    const cancelButtonRef = useRef(null)
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelButtonRef}
            onClose={toggleDialog}
            isCentered={true}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='regular'>
                        Delete <strong>{label}</strong>
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text fontWeight={700}>Are you sure?</Text>
                        <Text color="gray" fontStyle="italic">You can't undo this action afterwards.</Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelButtonRef} onClick={toggleDialog}>
                            Cancel
                        </Button>
                        <Button variant="outline" onClick={handleDelete} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default DeleteAlert
