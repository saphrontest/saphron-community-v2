import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import ProfileIcon from '../../assets/images/Vectors/profile.svg'
import { SCEditButton } from '../SCElements';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import defaultCover from '../../assets/images/default-cover.jpg'
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebaseClient';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUser, updateUser } from '../../Helpers/apiFunctions';

interface ProfileHeaderProps {
    name: string;
    username: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
    isEmailVerified: boolean;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({name, email, username, profilePhoto, coverPhoto, isEmailVerified}) => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()

    const handleEdit = (type: string) => {
        if(type === 'profile-photo')  {
            dispatch(setModal({isOpen: true, view: "editProfile"}))
        }
    }

    const verifyAccount = async () => {
        user && await sendEmailVerification(user)
    }

    useEffect(() => {
        if(user?.emailVerified && !isEmailVerified) {
            updateUser(user.uid, { emailVerified: true })
            getUser(user.uid)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.emailVerified])

    return (
        <>
            <Box bg="white" height="228px" bgImage={coverPhoto ?? defaultCover} bgPos="center" />
            <Flex minHeight="140px" bg={"white"}>
                <Image src={profilePhoto ?? ProfileIcon} width={"120px"} height={"120px"} border={"5px solid"} borderColor="gray.50" borderRadius={"80px"} pos="relative" left="5%" top="-40px"/>
                <Box pos="absolute" left="20%" p="16px" display="flex" alignItems="flex-start" flexDirection="column">
                    <Text fontSize="28px" fontWeight={700}>{name}</Text>
                    <Text fontWeight={500} color="gray.600">u/{username}</Text>
                    <Text fontWeight={500} fontStyle={"italic"}>{email}</Text>
                    {!isEmailVerified && <Flex align="center" gap={2}>
                        <Text color="red">E-mail erification is not completed!</Text>
                        <Text fontWeight={600} textDecor="underline" cursor="pointer" onClick={verifyAccount}>Verify</Text>
                    </Flex>}
                </Box>
                <SCEditButton onEdit={() => handleEdit("profile-photo")} position='absolute' right={16} transform="translateY(-16px)"/>
            </Flex>
        </>
    )
}

export default ProfileHeader