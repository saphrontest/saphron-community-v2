import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { FC } from 'react'
import { IoSettingsSharp } from 'react-icons/io5'
import { TiUserDelete } from 'react-icons/ti'
import { ImUserMinus } from "react-icons/im";
import { MdAccountBalanceWallet } from "react-icons/md";

const ProfileMenu: FC<{
    toggleDeleteUserAlertOpen: () => void;
    toggleBlockedUsersModal: () => void;
    goManageSubscriptions: () => void;
}> = ({
    toggleDeleteUserAlertOpen, toggleBlockedUsersModal, goManageSubscriptions
}) => {
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
                    <MenuItem display="flex" gap="1rem" onClick={toggleDeleteUserAlertOpen}>
                        <TiUserDelete /> Delete Account
                    </MenuItem>
                    <MenuItem display="flex" gap="1rem" onClick={toggleBlockedUsersModal}>
                        <ImUserMinus /> Blocked Users
                    </MenuItem>
                    <MenuItem display="flex" gap="1rem" onClick={goManageSubscriptions}>
                        <MdAccountBalanceWallet /> Manage Subscription
                    </MenuItem>
                </MenuList>
            </Menu>
        )
    }

export default ProfileMenu
