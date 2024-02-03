import { Flex, Divider, Spinner, Button, Text, useBoolean, Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import { WorkshopRequest, WorkshopStatusTypes } from '../../Interface/WorkshopInterface'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import moment from 'moment';

interface ParticipantItemProps {
    isLoading: boolean;
    participant: WorkshopRequest;
    handleButton: (event: any, requestId: string, status: WorkshopStatusTypes) => Promise<void>;
}
const ParticipantItem: FC<ParticipantItemProps> = ({ participant, isLoading, handleButton }) => {
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
                    {participant.date && <Text mb="0.4rem" fontSize={12} color="gray" textAlign="left"><strong>{participant.status}</strong> from {moment().format("DD.MM.YYYY HH:mm:ss")}</Text>}
                    <Text align="left" mb="0.5rem">{participant.motivation}</Text>
                    <Text fontWeight={600}>{participant.name}</Text>
                    <Divider w="20%" borderColor="gray" my="1rem" />
                    {participant.status === "confirmed" ? <Text fontWeight={600}>Join Request Confirmed</Text> : participant.status === "waiting" ? (
                        <>
                            <Text fontWeight={600} textAlign="center" w="100%" mb="0.8rem">Do you want to accept the request?</Text>
                            <Flex w="100%" justify="center" gap="1rem">
                                {isLoading ? <Spinner /> : (
                                    <>
                                        <Button w="fit-content" h="fit-content" p="0.5rem 2rem" onClick={ev => handleButton(ev, participant.id, "confirmed")}>Accept</Button>
                                        <Button w="fit-content" h="fit-content" p="0.5rem 2rem" variant="outline" onClick={ev => handleButton(ev, participant.id, "rejected")}>Reject</Button>
                                    </>
                                )}
                            </Flex>
                        </>
                    ) : <Text fontWeight={600}>Join Request Rejected</Text>}
                </>
            )}
        </Flex>
    )
}

export default ParticipantItem