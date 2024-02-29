import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { SCEditButton } from '../SCElements';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import menthalHealth from '../../assets/images/menthal.jpg'
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebaseClient';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUser, updateUser } from '../../Helpers/apiFunctions';
import { VscAccount } from 'react-icons/vsc';

interface ProfileHeaderProps {
    name: string;
    username: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
    isEmailVerified: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ name, email, username, profilePhoto, coverPhoto, isEmailVerified }) => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()

    const handleEdit = (type: string) => {
        if (type === 'profile-photo') {
            dispatch(setModal({ isOpen: true, view: "editProfile", data: {isEdit: true} }))
        }
    }

    const verifyAccount = async () => {
        user && await sendEmailVerification(user)
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
            <Box bg="white" height="228px" bgImage={!!coverPhoto ? coverPhoto : menthalHealth} bgPos="center" backgroundSize="cover"/>
            <Flex bg={"white"}>
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
                            pos="relative"
                            left="5%"
                            top="-40px"
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
                            pos="relative"
                            left="5%"
                            top="-40px"
                        />
                }

                <Box p="16px" display="flex" alignItems="flex-start" flexDirection="column" transform={{sm: "translateX(20%)", md: "translateX(35%)"}}>
                    <Text fontSize={["16px", "28px"]} fontWeight={700}>{name}</Text>
                    <Text fontSize={["12px", "16px"]} fontWeight={500} color="gray.600">u/{username}</Text>
                    <Text fontSize={["12px", "16px"]} fontWeight={500} fontStyle={"italic"}>{email}</Text>
                    {!isEmailVerified && <Flex align="center" gap={2}>
                        <Text color="red">E-mail erification is not completed!</Text>
                        <Text fontWeight={600} textDecor="underline" cursor="pointer" onClick={verifyAccount}>Verify</Text>
                    </Flex>}
                </Box>
                <SCEditButton onEdit={() => handleEdit("profile-photo")} position='absolute' right={16} transform="translateY(-16px)" />
            </Flex>
        </>
    )
}

export default ProfileHeader