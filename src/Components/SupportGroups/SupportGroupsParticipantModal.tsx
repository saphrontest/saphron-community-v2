import { ModalHeader, ModalCloseButton, ModalBody, Flex, Text } from '@chakra-ui/react'
import { updateDoc, doc } from 'firebase/firestore'
import { FC, Fragment } from 'react'
import { IStatus, ISupportGroupParticipant } from '../../Interface'
import { ModalLayout } from '../../Layouts'
import { firestore } from '../../firebaseClient'
import { PlatformParticipantItem } from '../Platform'

const SupportGroupsParticipantModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    participants: ISupportGroupParticipant[];
    supportGroupId: string;
    supportGroupName: string;
}> = ({
    isOpen, onClose, participants, supportGroupId, supportGroupName
}) => {

    const handleRequest = async (event: any, requestId: string, status: IStatus): Promise<void> => {
        event.stopPropagation()
        return await updateDoc(doc(firestore, `supportGroups/${supportGroupId}/participants/${requestId}`), {
            status: status
        })
    }

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <ModalHeader display="flex" flexDirection="column" alignItems="flex-start" w="100%">
                <Text textTransform="capitalize"><strong>{supportGroupName}</strong> Participants</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                pb={6}
            >
                <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    gap="1rem"
                >
                    {
                        participants.length && participants.map(participant => (
                            <Fragment key={participant.id}>
                                <PlatformParticipantItem
                                    isLoading={false}
                                    participant={participant}
                                    handleRequestButton={handleRequest}
                                />
                            </Fragment>
                        ))
                    }
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default SupportGroupsParticipantModal