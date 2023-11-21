import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { getPexelPhoto } from '../../pexelsClient'

interface ProfileHeaderProps {
    name: string;
    username: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({name, username}) => {

    const [profilePhoto, setProfilePhoto] = useState<any>()
    const [coverPhoto, setCoverPhoto] = useState<any>()

    const getProfilePhoto = async () => {
        const image = await getPexelPhoto("profile photo")
        setProfilePhoto(image?.src?.original as string)
    }
    
    const getCoverPhoto = async () => {
        const image = await getPexelPhoto("cover photo")
        setCoverPhoto(image?.src?.original as string)
    }

    useEffect(() => {
        getProfilePhoto()
        getCoverPhoto()
    }, [])

    return (
        <>
            <Box bg="white" height="228px" bgImage={coverPhoto} bgPos="center" />
            <Flex minHeight="100px" bg={"white"}>
                <Image src={profilePhoto} width={"120px"} height={"120px"} border={"5px solid"} borderColor="gray.50" borderRadius={"80px"} pos="relative" left="5%" top="-40px"/>
                <Box pos="absolute" left="15%" p="16px" display="flex" alignItems="flex-start" flexDirection="column" >
                    <Text fontSize="28px" fontWeight={700}>{name}</Text>
                    <Text fontWeight={500} color="gray.600">u/{username}</Text>
                </Box>
            </Flex>

        </>
    )
}

export default ProfileHeader