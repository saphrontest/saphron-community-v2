import { Flex, Button, Box, Text, Image } from '@chakra-ui/react'
import moment from 'moment'
import { setModal } from '../../redux/slices/modalSlice'
import { FC } from 'react'
import { Workshop } from '../../Interface/WorkshopInterface'
import { UserInterface } from '../../Interface/UserInterface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const JoinButton: FC<{
    showJoinButton: boolean;
    onClick: () => void;
}> = ({ showJoinButton, onClick }) => {
    if (showJoinButton) {
        return (
            <Flex paddingY="1rem" w="100%" justify="flex-end">
                <Button w="fit-content" h="fit-content" p="0.4rem 1.5rem" onClick={onClick}>
                    I wan't to join!
                </Button>
            </Flex>
        )
    }
    return null
}

const CustomLabel: FC<{
    text: string;
    bg: string; 
}> = ({ text, bg }) => {
    return (
        <Flex w="100%" justify="flex-end" paddingY="1rem">
            <Flex bg={bg} w="fit-content" padding="0.4rem 1.5rem" borderRadius={9999}>
                <Text fontWeight={600} color="white">{text}</Text>
            </Flex>
        </Flex>
    )
}

const WorkshopDetail: FC<{
    selected: Workshop | undefined;
    isRequested: boolean;
}> = ({ selected, isRequested }) => {
    const dispatch = useDispatch()
    const user: UserInterface = useSelector((state: RootState) => state.user)

    return selected ? (
        <Flex w="50%" h="fit-content" align="flex-start" justify="flex-start" direction="column" bg="gray.100" borderRadius="16px">
            <Flex
                w="100%"
                align="flex-end"
                color="white"
                bg="blue.500"
                height="150px"
                borderRadius="16px 16px 0px 0px"
                fontWeight={600}
                backgroundSize="cover"
                bgPos="center"
                bgImage={selected?.cover_img}
            >
                <Flex
                    width="100%"
                    height="100%"
                    align="flex-end"
                    color="white"
                    p="6px 10px"
                    bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.75))"
                >
                    
                    <Flex width="100%" justify="space-between" align="flex-end" h="100%" direction="row">
                        <Box>
                            <Text fontSize={22} fontWeight={700} marginBottom="0.3rem" align="left">
                                {selected?.workshop_name}
                            </Text>
                            <Box bg="white" w="fit-content" h="fit-content" p="0.2rem 0.6rem" borderRadius="99px">
                                <Text fontWeight="600" color="black">
                                    {selected?.category}
                                </Text>
                            </Box>
                        </Box>
                        <Flex direction="column" align="flex-end" justify="flex-end" h="100%">
                            <Flex align="center" gap={"0.7rem"}>
                                {selected.workshop_manager_avatar && <Image src={selected.workshop_manager_avatar} w="30px" borderRadius="30px" />}
                                <Text align="left" noOfLines={1}>
                                    {selected?.workshop_manager_name}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex p="1rem" direction="column">
                <Text fontWeight={700} align="left" mb="0.7rem">
                    {selected?.createdAt && moment(new Date(selected?.createdAt)).format("DD.MM.YYYY hh:mm")}
                </Text>
                <Text fontStyle="italic" align="left" mb="0.7rem">
                    {selected?.short_description}
                </Text>
                {selected?.detailed_description && <Text align="left" fontWeight="600" dangerouslySetInnerHTML={{ __html: selected?.detailed_description }} />}
                {
                    selected?.status === "confirmed"  && !isRequested ?
                        <JoinButton showJoinButton={selected?.workshop_manager_id !== user.id} onClick={() => dispatch(setModal({ isOpen: true, view: "joinWorkshop", data: selected }))} /> :
                        <CustomLabel
                        bg={isRequested && selected?.participants.find(participant => participant.userId === user.id)?.status === "confirmed" ? "green" : "gray"}
                        text={isRequested ? `Request is ${selected?.participants.find(participant => participant.userId === user.id)?.status}` : "Not verified yet"}
                        />
                }
            </Flex>
        </Flex>
    ) : null
}

export default WorkshopDetail