import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text } from '@chakra-ui/react'
import { FC, useRef } from 'react'

const DeleteWorkshopAlert: FC<{ isOpen: boolean; toggleDialog: () => void; handleDelete: () => void, workshopName: string; }> = ({isOpen, toggleDialog, handleDelete, workshopName}) => {
    const cancelButtonRef = useRef(null)
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelButtonRef}
            onClose={toggleDialog}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='regular'>
                        Delete <strong>{workshopName}</strong> Workshop
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

export default DeleteWorkshopAlert