import { ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { CgProfile } from 'react-icons/cg'
import { IoBookmarksSharp, IoSparkles } from 'react-icons/io5'
import { MdOutlineLogin } from 'react-icons/md'
import { VscAccount } from 'react-icons/vsc'
import { setModal } from '../../../redux/slices/modalSlice'
import { useDispatch } from 'react-redux'
import { User, signOut } from "firebase/auth";
import { FC } from 'react'
import { auth } from '../../../firebaseClient'
import { useNavigate } from 'react-router-dom'

interface UserMenuProps {
    user: User
}

const UserMenu: FC <UserMenuProps> = ({user}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logout = async () => await signOut(auth);
    return (
        <Menu>
            <MenuButton
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
            >
                <Flex alignItems="center">
                    <Flex alignItems="center">
                        {user ? (
                            <>
                                {/* Avatar should be user profile image */}
                                {user.photoURL && <Avatar src={user.photoURL} width={"30px"} height={"30px"} mr={2}/>}
                                <Box
                                    display={{ base: "none", lg: "flex" }}
                                    flexDirection="column"
                                    fontSize="8pt"
                                    alignItems="flex-start"
                                    mr={8}
                                >
                                    <Text fontWeight={700}>{user.displayName}</Text>
                                    <Flex alignItems="center">
                                        <Icon as={IoSparkles} color="brand.100" mr={1} />
                                        <Text color="gray.400">1 karma</Text>
                                    </Flex>
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
                {user ? (
                    <>
                        <MenuItem
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
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
                                <Icon as={IoBookmarksSharp} fontSize={20} mr={2}/>
                                Saved Posts
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