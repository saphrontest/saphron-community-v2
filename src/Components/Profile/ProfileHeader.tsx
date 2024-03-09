// ChakraUI && React
import { Box, Container, Flex, Icon, Image, Text, useBoolean, useToast } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
// Components
import { SCEditButton } from '../SCElements';
import { DeleteAlert } from '../Platform';
import ProfileMenu from './ProfileMenu';
import { VscAccount } from 'react-icons/vsc';
// Redux
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import { logoutUser } from '../../redux/slices/userSlice';
import { resetPosts } from '../../redux/slices/postSlice';
import { resetCommunities } from '../../redux/slices/communitySlice';
// Helpers
import { getUser, updateUser } from '../../Helpers/apiFunctions';
import { useNavigate } from 'react-router-dom';
// Firebase
import { auth, firestore } from '../../firebaseClient';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { Transaction, doc, runTransaction } from 'firebase/firestore';
import { useAuthState, useDeleteUser } from 'react-firebase-hooks/auth';
// Assets
import menthalHealth from '../../assets/images/menthal.jpg'

interface ProfileHeaderProps {
    name: string;
    username: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
    isEmailVerified: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ name, email, username, profilePhoto, coverPhoto, isEmailVerified }) => {
    const toast = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user] = useAuthState(auth)
    const [deleteUser] = useDeleteUser(auth)

    const userFromDB = useSelector((state: RootState) => state.user )
    
    const [deleteUserAlertOpen, { toggle: toggleDeleteUserAlertOpen }] = useBoolean(false)
    
    const verifyAccount = async () => {
        user && await sendEmailVerification(user)
    }

    const handleDeleteUser = async () => {
        deleteUser().then(success => {
            
            if(!success) {
                toast({
                    title: "Please try again later!",
                    status: "error",
                    isClosable: true,
                })
                return;
            }

            try {
                runTransaction(firestore, async (transaction: Transaction) => {
                    transaction.delete(doc(firestore, `users/${userFromDB.id}`))
                }).then(() => {
                    toast({
                        title: "User deleted successfully!",
                        status: "success",
                        isClosable: true,
                    })
                    signOut(auth)
                    toggleDeleteUserAlertOpen()
                    dispatch(logoutUser())
                    dispatch(resetCommunities())
                    dispatch(resetPosts())
                    navigate("/community")
                })
            } catch (error) {
                console.error("catch: ", error)
                toast({
                    title: "Please try again later!",
                    status: "error",
                    isClosable: true,
                })
            }
        })
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
                            <ProfileMenu toggleDeleteUserAlertOpen={toggleDeleteUserAlertOpen}/>
                        </Flex>
                    </Flex>
                </Container>
            </Flex>
            <DeleteAlert label={`${userFromDB?.username}`} isOpen={deleteUserAlertOpen} handleDelete={handleDeleteUser} toggleDialog={toggleDeleteUserAlertOpen}/>
        </>
    )
}

export default ProfileHeader