import { HamburgerIcon, DeleteIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, IconButton, MenuList, MenuItem } from "@chakra-ui/react"
import { FC } from "react"
import { FaUsers } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const ChatMenu:FC<{ toggleDeleteModal: () => void; }> = ({ toggleDeleteModal }) => {
    const navigate = useNavigate()
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
            <MenuItem icon={<DeleteIcon />} onClick={() => toggleDeleteModal()}>
                Remove Support Group
            </MenuItem>
            <MenuItem icon={<FaUsers />} onClick={() => navigate("/my-support-groups")}>
                Show Participants
            </MenuItem>
        </MenuList>
    </Menu>
    )
}

export default ChatMenu