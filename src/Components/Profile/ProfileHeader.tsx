import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import ProfileIcon from '../../assets/images/Vectors/profile.svg'
import { SCEditButton } from '../SCElements';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import defaultCover from '../../assets/images/default-cover.jpg'

interface ProfileHeaderProps {
    name: string;
    username: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({name, email, username, profilePhoto, coverPhoto}) => {

    const dispatch = useDispatch()

    const handleEdit = (type: string) => {
        if(type === 'profile-photo')  {
            dispatch(setModal({isOpen: true, view: "editProfile"}))
        }
    }

    return (
        <>
            <Box bg="white" height="228px" bgImage={coverPhoto ?? defaultCover} bgPos="center" />
            <Flex minHeight="100px" bg={"white"}>
                <Image src={profilePhoto ?? ProfileIcon} width={"120px"} height={"120px"} border={"5px solid"} borderColor="gray.50" borderRadius={"80px"} pos="relative" left="5%" top="-40px"/>
                <Box pos="absolute" left="20%" p="16px" display="flex" alignItems="flex-start" flexDirection="column">
                    <Text fontSize="28px" fontWeight={700}>{name}</Text>
                    <Text fontWeight={500} color="gray.600">u/{username}</Text>
                    <Text fontWeight={500} fontStyle={"italic"}>{email}</Text>
                </Box>
                <SCEditButton onEdit={() => handleEdit("profile-photo")} position='absolute' right={16} transform="translateY(-16px)"/>
            </Flex>

        </>
    )
}

export default ProfileHeader