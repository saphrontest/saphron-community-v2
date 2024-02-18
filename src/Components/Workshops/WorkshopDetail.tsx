import { Flex, Button, Box, Text, Image, useToast, useMediaQuery } from '@chakra-ui/react'
import moment from 'moment'
import { setModal } from '../../redux/slices/modalSlice'
import { FC } from 'react'
import { Workshop } from '../../Interface/WorkshopInterface'
import { UserInterface } from '../../Interface/UserInterface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { PlatformItemDetailLayout } from '../../Layouts'

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

    const toast = useToast()
    const dispatch = useDispatch()
  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
    const user: UserInterface = useSelector((state: RootState) => state.user)

    return selected && !isSmallerThan766 ? (
        <PlatformItemDetailLayout coverImg={selected?.cover_img}>
            <>
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
            </>
            <>
                <Text fontWeight={700} align="left" mb="0.7rem">
                    {selected?.createdAt && moment(new Date(selected?.createdAt)).format("DD.MM.YYYY hh:mm")}
                </Text>
                <Text fontStyle="italic" align="left" mb="0.7rem">
                    {selected?.short_description}
                </Text>
                {selected?.detailed_description && <Text align="left" fontWeight="600" dangerouslySetInnerHTML={{ __html: selected?.detailed_description }} />}
                {
                    selected?.status === "confirmed" && !isRequested ?
                        <JoinButton showJoinButton={selected?.workshop_manager_id !== user.id} onClick={() => {
                            if (!user.id) {
                                toast({
                                    title: "Please login, first!",
                                    status: "error",
                                    isClosable: true,
                                    position: "top-right"
                                })
                                return;
                            }
                            dispatch(setModal({ isOpen: true, view: "joinWorkshop", data: selected }))
                        }} /> :
                        <CustomLabel
                            bg={isRequested && selected?.participants.find(participant => participant.userId === user.id)?.status === "confirmed" ? "green" : "gray"}
                            text={isRequested ? `Request is ${selected?.participants.find(participant => participant.userId === user.id)?.status}` : "Not verified yet"}
                        />
                }
            </>
        </PlatformItemDetailLayout>
    ) : null
}

export default WorkshopDetail