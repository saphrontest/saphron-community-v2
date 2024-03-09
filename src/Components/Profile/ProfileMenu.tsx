import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { FC } from 'react'
import { IoSettingsSharp } from 'react-icons/io5'
import { TiUserDelete } from 'react-icons/ti'

const ProfileMenu: FC<{toggleDeleteUserAlertOpen: () => void}> = ({toggleDeleteUserAlertOpen}) => {
    return (
        <Menu>
            <MenuButton
                as={Button}
                gap={2}
                padding={2}
                bg="gray.200"
                borderRadius={32}
                border={"2px solid"}
                borderColor={"white"}
                height={"fit-content"}
                width="fit-content"
                cursor={"pointer"}
                _hover={{ backgroundColor: "gray.300" }}
            >
                <IoSettingsSharp size={24} fill='#718096' />
            </MenuButton>

            <MenuList>
                <MenuItem display="flex" gap="1rem" onClick={() => toggleDeleteUserAlertOpen()}>
                    <TiUserDelete /> Delete User
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default ProfileMenu
