import { ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { setModal } from '../../../redux/slices/modalSlice'
import { useDispatch } from 'react-redux'
import { signOut } from "firebase/auth";
import { FC, ReactElement } from 'react'
import { auth } from '../../../firebaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { UserInterface } from '../../../Interface/UserInterface'
import { logoutUser } from '../../../redux/slices/userSlice'
import NotFoundUserPic from '../../../assets/images/user.png'
import { resetCommunities } from '../../../redux/slices/communitySlice'
import { resetPosts } from '../../../redux/slices/postSlice'
import { GrWorkshop } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from 'react-icons/cg'
import { FaRegBookmark } from "react-icons/fa";
import { MdOutlineLogin } from 'react-icons/md'
import { VscAccount } from 'react-icons/vsc'
import { IconType } from 'react-icons';
import { GrGroup } from "react-icons/gr";

interface UserMenuProps {
    user: UserInterface
}

const MenuItemInner: FC<{ to: string; icon: IconType; label: string; }> = ({ to, icon, label }) => {
    return (
        <Link to={to}>
            <Flex alignItems="center">
                <Icon as={icon} fontSize={20} mr={2} />
                {label}
            </Flex>
        </Link>
    )
}

const CustomMenuItem: FC<{ children: ReactElement }> = ({ children }) => {
    return (
        <MenuItem
            fontSize="10pt"
            fontWeight={700}
            _hover={{ bg: "blue.500", color: "white" }}
        >
            {children}
        </MenuItem>

    )
}

const UserMenu: FC<UserMenuProps> = ({ user }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logout = async () => {
        await signOut(auth);
        dispatch(logoutUser())
        dispatch(resetCommunities())
        dispatch(resetPosts())
        navigate("/community")
    }

    return (
        <Menu>
            <MenuButton
                minH="34px"
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                outline={"1px solid"}
                outlineColor={"gray.100"}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
            >
                <Flex alignItems="center">
                    <Flex alignItems="center">
                        {user.id ? (
                            <>
                                <Avatar
                                    mr={2}
                                    style={{ width: 26, height: 26 }}
                                    boxSize={user.profilePhotoURL ? 28 : 30}
                                    src={user.profilePhotoURL ?? NotFoundUserPic}
                                />
                                <Box
                                    mr={8}
                                    fontSize="8pt"
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    display={{ base: "none", lg: "flex" }}
                                >
                                    <Text fontWeight={700}>{user.displayName ?? user.email?.split("@")[0]}</Text>
                                </Box>
                            </>
                        ) : (
                            <Icon
                                fontSize={24}
                                mr={1}
                                color="gray.400"
                                as={VscAccount}
                            />
                        )}
                    </Flex>
                    <ChevronDownIcon color="gray.500" />
                </Flex>
            </MenuButton>
            <MenuList>
                {user.id ? (
                    <>
                        <CustomMenuItem>
                            <MenuItemInner to='/community/profile' icon={CgProfile} label="Profile" />
                        </CustomMenuItem>
                        <CustomMenuItem>
                            <MenuItemInner to='/community/saved-posts' icon={FaRegBookmark} label="Saved Posts" />
                        </CustomMenuItem>
                        <CustomMenuItem>
                            <MenuItemInner to='/my-workshops' icon={GrWorkshop} label="My Workshops" />
                        </CustomMenuItem>
                        <CustomMenuItem>
                            <MenuItemInner to='/my-support-groups' icon={GrGroup} label="My Support Groups" />
                        </CustomMenuItem>
                        {
                            user.role === "admin" &&
                                <CustomMenuItem>
                                    <MenuItemInner to='/admin' icon={RiAdminLine} label="Dashboard" />
                                </CustomMenuItem>
                        }
                        <MenuDivider />
                        <MenuItem
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
                            onClick={() => logout()}
                        >
                            <Flex alignItems="center">
                                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                                Log Out
                            </Flex>
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
                            onClick={() => dispatch(setModal({ isOpen: true, view: "login" }))}
                        >
                            <Flex alignItems="center">
                                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                                Log In / Sign Up
                            </Flex>
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    )
}

export default UserMenu