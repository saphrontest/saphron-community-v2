import { Flex, Divider, Spinner, Button, Text, Box, useBoolean } from '@chakra-ui/react'
import moment from 'moment'
import React, { FC } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { IStatus } from '../../Interface/StatusInterface';

interface IParticipantAsProp {
    id: string;
    userId: string;
    updatedAt: string;
    motivation: string;
    name: string;
    status: IStatus;
}

interface IPlatformParticipantItemProps {
    isLoading: boolean;
    participant: IParticipantAsProp;
    handleRequestButton: (event: any, requestId: string, status: IStatus) => Promise<void>;
}

interface IParticipantActionButtonsProps extends IPlatformParticipantItemProps { }

const ParticipantActionButtons: FC<IParticipantActionButtonsProps> = ({
    isLoading, participant, handleRequestButton
}) => {
    return (
        <>
            <Text fontWeight={600} textAlign="center" w="100%" mb="0.8rem" fontSize={["12", "16"]}>Do you want to accept the request?</Text>
            <Flex w="100%" justify="center" gap="1rem">
                {isLoading ? <Spinner /> : (
                    <>
                        <Button w="fit-content" h="fit-content" p="0.5rem 2rem" fontSize={["10", "16"]} onClick={ev => handleRequestButton(ev, participant.id, "confirmed")}>Accept</Button>
                        <Button w="fit-content" h="fit-content" p="0.5rem 2rem" fontSize={["10", "16"]} variant="outline" onClick={ev => handleRequestButton(ev, participant.id, "rejected")}>Reject</Button>
                    </>
                )}
            </Flex>
        </>
    )
}

const PlatformParticipantItem: FC<IPlatformParticipantItemProps> = ({
    participant, isLoading, handleRequestButton
}) => {
    const [isClicked, setIsClicked] = useBoolean(false)
    return (
        <Flex direction="column" align="flex-start" bg="gray.100" p="1rem" w="100%" borderRadius="0.4rem" onClick={ev => ev.stopPropagation()}>
            <Flex
                w="100%"
                align="center"
                direction="row"
                justify="space-between"
                cursor="pointer"
                onClick={ev => {
                    ev.stopPropagation()
                    setIsClicked.toggle()
                }}
            >
                <Text fontSize={12} color="gray" textAlign="left"><strong>USER ID</strong> {participant.userId}</Text>
                <Box bg="gray.300" borderRadius={9999}>
                    {!isClicked ? <MdKeyboardArrowDown size={24} /> : <MdKeyboardArrowUp size={24} />}
                </Box>
            </Flex>
            {isClicked && (
                <>
                    <Divider w="20%" borderColor="gray" my="1rem" />
                    {participant.updatedAt && <Text mb="0.4rem" fontSize={12} color="gray" textAlign="left">Status is <strong>{participant.status}</strong> from {moment(participant.updatedAt).format("DD.MM.YYYY HH:mm:ss")}.</Text>}
                    <Text align="left" mb="0.5rem" fontSize={["12", "16"]}>{participant.motivation}</Text>
                    <Text fontWeight={600} fontSize={["12", "16"]}>{participant.name}</Text>
                    <Divider w="20%" borderColor="gray" my="1rem" />
                    {
                        participant.status === "confirmed" ? (
                            <Text fontWeight={600} fontSize={["12", "16"]}>Join Request Confirmed</Text>
                        ) : participant.status === "waiting" ? (
                            <ParticipantActionButtons
                            isLoading={isLoading}
                            participant={participant}
                            handleRequestButton={handleRequestButton}
                            />
                        ) : <Text fontWeight={600}>Join Request Rejected</Text>
                    }
                </>
            )}
        </Flex>
    )
}

export default PlatformParticipantItem
