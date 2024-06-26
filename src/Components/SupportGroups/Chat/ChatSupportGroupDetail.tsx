import { Flex, Stack, Icon, Avatar, Image, Text, useBoolean, useToast } from '@chakra-ui/react'
import { IoIosInformationCircle } from 'react-icons/io'
import { ISupportGroup, IUser } from '../../../Interface'
import DescriptionModal from './DescriptionModal'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../../../redux/slices/modalSlice'
import { DeleteAlert } from '../../Platform'
import { useChat, useSupportGroup } from '../../../Hooks'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../redux/store'
import ChatJoinButton from './ChatJoinButton'
import ChatMenu from './ChatMenu'
import SupportGroupsParticipantModal from '../SupportGroupsParticipantModal'
import moment from 'moment'



const ChatSupportGroupDetail: React.FC<{ supportGroup: ISupportGroup; }> = ({ supportGroup }) => {
    const toast = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user: IUser = useSelector((state: RootState) => state.user)
    const { onDelete: deleteSupportGroup } = useSupportGroup()
    const { onDelete: deleteChat } = useChat()

    const [isDeleteModal, { toggle: toggleDeleteModal }] = useBoolean()
    const [showDescriptionModal, { toggle: toggleDescriptionModal }] = useBoolean()
    const [showParticipantModal, { toggle: toggleParticipantModal }] = useBoolean()

    const handleDelete = async () => {
        supportGroup.id && deleteChat(supportGroup.id).then(result => {
            if (result) {
                deleteSupportGroup(supportGroup)
                    .then(result => {
                        if (result) {
                            navigate("/support-groups")
                            return;
                        }
                        toast({
                            title: "Please, try again later.",
                            status: "error",
                            isClosable: true,
                            position: "top-right"
                        })
                        return;
                    })
                return;
            }
            toast({
                title: "Please, try again later.",
                status: "error",
                isClosable: true,
                position: "top-right"
            })
        })
    }

    return (
        <>
            <Flex direction="row" gap="1rem" w="100%">
                <Image src={supportGroup.cover_img} h="125px" borderRadius="1rem" display={{base: "none", sm: "none", md: "block"}}/>
                <Stack w="100%" h="100%">
                    <Flex direction="row" w="100%" justify="space-between" align="center">
                        <Text fontSize="24px" fontWeight={600} textTransform="capitalize" align="left">
                            {supportGroup.support_group_name}
                        </Text>
                        <Flex align="center" gap="0.4rem">
                            <ChatJoinButton
                                isAdmin={supportGroup.support_group_manager_id === user.id}
                                isUserParticipant={supportGroup?.participants?.some(participant => participant.userId === user.id) || false}
                                isUserConfirmedParticipant={supportGroup?.participants?.some(participant => participant.userId === user.id && participant.status === "waiting") || false}
                                handleJoinButton={() => {
                                    if (!user.id) {
                                        toast({
                                            title: "Please login, first!",
                                            status: "error",
                                            isClosable: true,
                                            position: "top-right"
                                        })
                                        return;
                                    }
                                    dispatch(setModal({ isOpen: true, view: "joinSupportGroup", data: supportGroup }))
                                }}
                            />
                            <Icon as={IoIosInformationCircle} cursor="pointer" color="blue.500" _hover={{ color: "blue.400" }} width="38px" height="38px" onClick={toggleDescriptionModal} />
                            {supportGroup.support_group_manager_id === user.id &&
                                <ChatMenu toggleDeleteModal={toggleDeleteModal} toggleParticipantModal={toggleParticipantModal}/>
                            }
                        </Flex>
                    </Flex>
                    <Flex display={{base: "none", sm: "flex"}} direction="row" justify="space-between" align="center" bg="gray.100" p="1rem" w="100%" h="100%" borderRadius="1rem">
                        <Flex direction="row" gap="1rem" align="center">
                            <Avatar src={supportGroup.support_group_manager_avatar} />
                            <Flex direction="column">
                                <Text align="left" fontWeight="600">
                                    {supportGroup.support_group_manager_name}
                                </Text>
                                <Text align="left" fontWeight="600">
                                    {supportGroup.support_group_manager_mail}
                                </Text>
                            </Flex>
                        </Flex>
                        <Text align="left" mb="0.7rem" fontWeight={600}>
                            {moment(supportGroup.createdAt).format("DD.MM.YYYY")}
                        </Text>
                    </Flex>
                </Stack>
            </Flex>
            <DescriptionModal
                isOpen={showDescriptionModal}
                onClose={toggleDescriptionModal}
                name={supportGroup.support_group_name}
                description={supportGroup.description}
            />
            {isDeleteModal && <DeleteAlert isOpen={isDeleteModal} toggleDialog={toggleDeleteModal} handleDelete={handleDelete} label={`${supportGroup.support_group_name} Support Group`} />}
            {showParticipantModal && <SupportGroupsParticipantModal isOpen={showParticipantModal} participants={supportGroup.participants ?? []} onClose={toggleParticipantModal} supportGroupId={supportGroup.id!} supportGroupName={supportGroup.support_group_name}/>}
        </>
    )
}

export default ChatSupportGroupDetail
