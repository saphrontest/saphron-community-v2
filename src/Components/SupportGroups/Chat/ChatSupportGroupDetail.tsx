import { Flex, Stack, Icon, Avatar, Image, Text, useBoolean, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react'
import { FC } from 'react'
import { IoIosInformationCircle } from 'react-icons/io'
import { ISupportGroup, UserInterface } from '../../../Interface'
import DescriptionModal from './DescriptionModal'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../../../redux/slices/modalSlice'
import { HamburgerIcon, DeleteIcon } from '@chakra-ui/icons'
import { DeleteAlert } from '../../Platform'
import { useChat, useSupportGroup } from '../../../Hooks'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../redux/store'
import { FaUsers } from "react-icons/fa6";

const ChatSupportGroupDetail: FC<{ supportGroup: ISupportGroup; }> = ({ supportGroup }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const showErrorToast = useToast({
        title: "Please, try again later.",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
    const user: UserInterface = useSelector((state: RootState) => state.user)
    const {onDelete: deleteSupportGroup} = useSupportGroup()
    const {onDelete: deleteChat} = useChat()

    const [isDeleteModal, { toggle: toggleDeleteModal }] = useBoolean()
    const [showDescriptionModal, { toggle: toggleDescriptionModal }] = useBoolean()

    const handleDelete = async () => {
        supportGroup.id && deleteChat(supportGroup.id).then(result => {
            if(result) {
                deleteSupportGroup(supportGroup)
                .then(result => {
                    if(result) {
                        navigate("/support-groups")
                        return;
                    }
                    showErrorToast()
                    return;
                })
                return;
            }
            showErrorToast()
        })
    }

    const JoinButton = () => {
        if(supportGroup.support_group_manager_id === user.id) {
            return null
        }
        if(!!supportGroup?.participants?.find(participant => participant.userId === user.id)) {
            if(supportGroup?.participants?.find(participant => participant.userId === user.id && participant.status === "waiting")) {
                return <Flex align="center" bg="gray" color="white" height="30px" padding="0 1rem" borderRadius="1rem" fontWeight="600">Applied</Flex>
            }
            return null
        }
        return <Button height="30px" onClick={() => dispatch(setModal({isOpen: true, view: "joinSupportGroup", data: supportGroup}))}>Join</Button>
    }
    
    return (
        <>
            <Flex direction="row" gap="1rem" w="100%">
                <Image src={supportGroup.cover_img} h="125px" borderRadius="1rem" />
                <Stack w="100%" h="100%">
                    <Flex direction="row" w="100%" justify="space-between" align="center">
                        <Text fontSize="24px" fontWeight={600} textTransform="capitalize" align="left">
                            {supportGroup.support_group_name}
                        </Text>
                        <Flex align="center" gap="0.4rem">
                            <JoinButton />
                            <Icon as={IoIosInformationCircle} cursor="pointer" color="blue.500" _hover={{ color: "blue.400" }} width="38px" height="38px" onClick={toggleDescriptionModal} />
                            {supportGroup.support_group_manager_id === user.id && <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label='Options'
                                    icon={<HamburgerIcon />}
                                    variant='solid'
                                    width="30px"
                                    height="30px"
                                    minWidth="30px"
                                />
                                <MenuList>
                                    <MenuItem icon={<DeleteIcon />} onClick={() => toggleDeleteModal()}>
                                        Remove Support Group
                                    </MenuItem>
                                    <MenuItem icon={<FaUsers />} onClick={() => navigate("/my-support-groups")}>
                                        Show Participants
                                    </MenuItem>
                                </MenuList>
                            </Menu>}
                        </Flex>
                    </Flex>
                    <Flex direction="row" justify="space-between" align="center" bg="gray.100" p="1rem" w="100%" h="100%" borderRadius="1rem">
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
                            {supportGroup.createdAt}
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
        </>
    )
}

export default ChatSupportGroupDetail
