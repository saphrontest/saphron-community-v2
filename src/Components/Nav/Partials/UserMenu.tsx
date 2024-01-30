import { ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { CgProfile } from 'react-icons/cg'
import { FaRegBookmark } from "react-icons/fa";
import { MdOutlineLogin } from 'react-icons/md'
import { VscAccount } from 'react-icons/vsc'
import { setModal } from '../../../redux/slices/modalSlice'
import { useDispatch } from 'react-redux'
import { signOut } from "firebase/auth";
import { FC } from 'react'
import { auth } from '../../../firebaseClient'
import { useNavigate } from 'react-router-dom'
import { UserInterface } from '../../../Interface/UserInterface'
import { logoutUser } from '../../../redux/slices/userSlice'
import NotFoundUserPic from '../../../assets/images/user.png'
import { resetCommunities } from '../../../redux/slices/communitySlice'
import { resetPosts } from '../../../redux/slices/postSlice'
import { GrWorkshop } from "react-icons/gr";
interface UserMenuProps {
    user: UserInterface
}

const UserMenu: FC <UserMenuProps> = ({user}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logout = async () => {
        await signOut(auth);
        dispatch(logoutUser())
        dispatch(resetCommunities())
        dispatch(resetPosts())
        navigate("/")
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
                                {/* Avatar should be user profile image */}
                                <Avatar
                                mr={2}
                                style={{width: 26, height: 26}}
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
                        <MenuItem
                        fontSize="10pt"
                        fontWeight={700}
                        _hover={{ bg: "blue.500", color: "white" }}
                        onClick={() => navigate("/profile")}
                        >
                            <Flex alignItems="center">
                                <Icon fontSize={20} mr={2} as={CgProfile} />
                                Profile
                            </Flex>
                        </MenuItem>
                        <MenuItem
                        fontSize="10pt"
                        fontWeight={700}
                        _hover={{ bg: "blue.500", color: "white" }}
                        onClick={() => navigate("/saved-posts")}
                        >
                            <Flex alignItems="center">
                                <Icon as={FaRegBookmark} fontSize={20} mr={2}/>
                                Saved Posts
                            </Flex>
                        </MenuItem>
                        <MenuItem
                        fontSize="10pt"
                        fontWeight={700}
                        _hover={{ bg: "blue.500", color: "white" }}
                        onClick={() => navigate("/my-workshops")}
                        >
                            <Flex alignItems="center">
                                <Icon as={GrWorkshop} fontSize={20} mr={2}/>
                                My Workshops
                            </Flex>
                        </MenuItem>
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