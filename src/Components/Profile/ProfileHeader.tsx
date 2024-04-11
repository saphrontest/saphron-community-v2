// ChakraUI && React
import { Box, Container, Flex, Icon, Image, Text, useBoolean, useToast } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
// Components
import { SCEditButton } from '../SCElements';
import { DeleteAlert } from '../Platform';
import ProfileMenu from './ProfileMenu';
import { VscAccount } from 'react-icons/vsc';
import { MembershipBadge } from '../Membership';
import BlockedUsersModal from './BlockedUsersModal';
// Redux
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import { logoutUser } from '../../redux/slices/userSlice';
import { resetMyCommunities } from '../../redux/slices/communitySlice';
// Helpers
import { getUser, updateUser } from '../../Helpers/apiFunctions';
import { useNavigate } from 'react-router-dom';
import { IMembership } from '../../Interface';
import { usePayment } from '../../Hooks';
// Firebase
import { FirebaseError } from 'firebase/app';
import { auth, firestore } from '../../firebaseClient';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { FirestoreError, Transaction, doc, runTransaction } from 'firebase/firestore';
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
    membership?: IMembership;
    isMine: boolean;
    userId?: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
    name,
    email,
    username,
    profilePhoto,
    coverPhoto,
    isEmailVerified,
    membership,
    isMine,
    userId
}) => {

    const toast = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user] = useAuthState(auth)
    const [deleteUser] = useDeleteUser(auth)
    const { createPortalLink, checkUserIsStripeCustomer } = usePayment()

    const userFromDB = useSelector((state: RootState) => state.user)

    const [deleteUserAlertOpen, { toggle: toggleDeleteUserAlertOpen }] = useBoolean(false)
    const [blockedUsersModalOpen, { toggle: toggleBlockedUsersModal }] = useBoolean(false)
    const [manageSubscriptionLoading, { toggle: toggleManageSubscriptionLoading }] = useBoolean(false)
    const [isStripeCustomer, setIsStripeCustomer] = useState<boolean>(false)

    const verifyAccount = async () => {
        user && await sendEmailVerification(user)
    }

    const handleDeleteUser = async () => {
        deleteUser().then(success => {

            if (!success) {
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
                    dispatch(resetMyCommunities())
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

    const goManageSubscriptions = async () => {
        toggleManageSubscriptionLoading()
        try {
            const portalLink = await createPortalLink()

            if (!portalLink) {
                toast({
                    title: "Please try again later!",
                    status: "error",
                    isClosable: true,
                })
                return;
            }

            window.location.assign(portalLink);
        } catch (error) {
            if (error instanceof FirestoreError || error instanceof FirebaseError) {
                toast({
                    title: error.message,
                    status: "error",
                    isClosable: true,
                })
            }
        } finally {
            toggleManageSubscriptionLoading()
        }
    }

    useEffect(() => {
        
        if (user?.emailVerified && !isEmailVerified) {
            updateUser(user.uid, { emailVerified: true })
            getUser(user.uid)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.emailVerified])

    useEffect(() => {

        checkUserIsStripeCustomer(
            isMine ? userFromDB.id : userId
        ).then(res => {
            setIsStripeCustomer(res !== undefined && res)
        })
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                                <Flex align='center' gap="1rem">
                                    <Text fontSize={["16px", "20px", "28px"]} fontWeight={700}>{name}</Text>
                                    {membership?.active && <MembershipBadge membershipType={membership?.name.split(' ')[0] || ''} />}
                                </Flex>
                                <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} color="gray.600">u/{username}</Text>
                                <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} fontStyle={"italic"}>{email}</Text>
                                {(!isEmailVerified && isMine) && <Flex align="center" gap={2}>
                                    <Text color="red">E-mail erification is not completed!</Text>
                                    <Text fontWeight={600} textDecor="underline" cursor="pointer" onClick={verifyAccount}>Verify</Text>
                                </Flex>}
                            </Box>
                        </Flex>
                        {
                            isMine && (
                                <Flex transform={["translateY(-65%)", "translateY(-65%)", "translateY(-80%)"]} gap="1rem" direction={["column", "column", "row"]}>
                                    <SCEditButton onEdit={() => dispatch(setModal({ isOpen: true, view: "editProfile", data: { isEdit: true } }))} />
                                    <ProfileMenu
                                        isLoading={manageSubscriptionLoading}
                                        toggleDeleteUserAlertOpen={toggleDeleteUserAlertOpen}
                                        toggleBlockedUsersModal={toggleBlockedUsersModal}
                                        goManageSubscriptions={goManageSubscriptions}
                                        isStripeCustomer={isStripeCustomer}
                                    />
                                </Flex>
                            )
                        }
                    </Flex>
                </Container>
            </Flex>
            {isMine && (
                <>
                    <DeleteAlert label={`${userFromDB?.username}`} isOpen={deleteUserAlertOpen} handleDelete={handleDeleteUser} toggleDialog={toggleDeleteUserAlertOpen} />
                    <BlockedUsersModal isOpen={blockedUsersModalOpen} toggleModal={toggleBlockedUsersModal} />
                </>
            )}
        </>
    )
}

export default ProfileHeader