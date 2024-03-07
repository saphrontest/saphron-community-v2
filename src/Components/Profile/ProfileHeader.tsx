import { Box, Button, Container, Flex, Icon, Image, Menu, MenuButton, MenuItem, MenuList, Text, useBoolean, useToast } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { SCEditButton } from '../SCElements';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import menthalHealth from '../../assets/images/menthal.jpg'
import { sendEmailVerification } from 'firebase/auth';
import { auth, firestore } from '../../firebaseClient';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUser, updateUser } from '../../Helpers/apiFunctions';
import { VscAccount } from 'react-icons/vsc';
import { IoSettingsSharp } from "react-icons/io5";
import { TiUserDelete } from "react-icons/ti";
import { DeleteAlert } from '../Platform';
import { RootState } from '../../redux/store';
import { Transaction, doc, runTransaction } from 'firebase/firestore';

interface ProfileHeaderProps {
    name: string;
    username: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
    isEmailVerified: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ name, email, username, profilePhoto, coverPhoto, isEmailVerified }) => {
    const dispatch = useDispatch()
    const toast = useToast()
    const [user] = useAuthState(auth)

    const userFromDB = useSelector((state: RootState) => state.user )
    
    const [deleteUserAlertOpen, { toggle: toggleDeleteUserAlertOpen }] = useBoolean(false)
    
    const verifyAccount = async () => {
        user && await sendEmailVerification(user)
    }

    const handleDeleteUser = () => {
        console.log(user)
                try {
                    runTransaction(firestore, async (transaction: Transaction) => {
                        transaction.update(doc(firestore, `users/${userFromDB.id}`), {
                            isDeleted: true
                        })
                    })
                } catch (error) {
                    console.error("catch: ", error)
                    toast({
                        title: "Please try again later!",
                        status: "error",
                        isClosable: true,
                    })
                }
    }

    useEffect(() => {
        if (user?.emailVerified && !isEmailVerified) {
            updateUser(user.uid, { emailVerified: true })
            getUser(user.uid)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.emailVerified])

    return (
        <>
            <Flex bg="white" direction="column">
                <Box bg="white" height="228px" bgImage={!!coverPhoto ? coverPhoto : menthalHealth} bgPos="center" backgroundSize="cover" />
                <Container maxW='container.xl'>
                    <Flex p="16px" alignItems="flex-start" justify="space-between" flexDirection="row">
                        <Flex gap="1rem">
                            {
                                !!profilePhoto ?
                                    <Image
                                        bg="white"
                                        src={profilePhoto}
                                        width={{ base: "90px", sm: "120px" }}
                                        height={{ base: "90px", sm: "120px" }}
                                        border={"5px solid"}
                                        borderColor="gray.50"
                                        borderRadius={"80px"}
                                        transform="translateY(-50%)"
                                    /> :
                                    <Icon
                                        bg="white"
                                        fontSize={{ base: "90px", sm: "120px" }}
                                        mr={1}
                                        color="gray.400"
                                        as={VscAccount}
                                        border={"5px solid"}
                                        borderColor="gray.50"
                                        borderRadius={"80px"}
                                        transform="translateY(-50%)"
                                    />
                            }
                            <Box textAlign="left">
                                <Text fontSize={["16px", "20px", "28px"]} fontWeight={700}>{name}</Text>
                                <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} color="gray.600">u/{username}</Text>
                                <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} fontStyle={"italic"}>{email}</Text>
                                {!isEmailVerified && <Flex align="center" gap={2}>
                                    <Text color="red">E-mail erification is not completed!</Text>
                                    <Text fontWeight={600} textDecor="underline" cursor="pointer" onClick={verifyAccount}>Verify</Text>
                                </Flex>}
                            </Box>
                        </Flex>
                        <Flex transform="translateY(-80%)" gap="1rem">
                            <SCEditButton onEdit={() => dispatch(setModal({ isOpen: true, view: "editProfile", data: { isEdit: true } }))} />
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
                                    onClick={() => console.log("profile settings")}
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
                        </Flex>
                    </Flex>
                </Container>
            </Flex>
            <DeleteAlert label={`${userFromDB?.username}`} isOpen={deleteUserAlertOpen} handleDelete={handleDeleteUser} toggleDialog={toggleDeleteUserAlertOpen}/>
        </>
    )
}

export default ProfileHeader