import { HamburgerIcon, DeleteIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, IconButton, MenuList, MenuItem } from "@chakra-ui/react"
import { FC } from "react"
import { FaUsers } from "react-icons/fa"

const ChatMenu:FC<{ toggleDeleteModal: () => void; toggleParticipantModal: () => void; }> = ({
    toggleDeleteModal, toggleParticipantModal
}) => {
    return (
        <Menu>
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
                <MenuItem icon={<DeleteIcon />} onClick={toggleDeleteModal}>
                    Remove Support Group
                </MenuItem>
                <MenuItem icon={<FaUsers />} onClick={toggleParticipantModal}>
                    Show Participants
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default ChatMenu