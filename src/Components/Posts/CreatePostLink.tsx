import React, { FC } from 'react'
import { Flex, Icon, Image, Input } from '@chakra-ui/react'
import { BsLink45Deg } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import LogoIcon from '../../assets/Logo/logo-icon.png'
import { useNavigate } from 'react-router-dom';

interface CreatePostLinkProps {
  communityId?: string;
}

const CreatePostLink : FC <CreatePostLinkProps> = ({communityId}) => {
  const navigate = useNavigate()
  return (
    <Flex
        justify="space-evenly"
        align="center"
        bg="white"
        height="56px"
        borderRadius={4}
        border="1px solid"
        borderColor="gray.300"
        p={2}
        mb={4}
        onClick={() => navigate(`/submit/${communityId}`)}
      >
        <Image src={LogoIcon} width={8} mr={2}/>
        <Input
          placeholder="Create Post"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          bg="gray.50"
          borderColor="gray.200"
          height="36px"
          borderRadius={4}
          mr={4}
        />
        <Icon
          as={IoImageOutline}
          fontSize={24}
          mr={4}
          color="gray.400"
          cursor="pointer"
        />
        <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
      </Flex>
  )
}

export default CreatePostLink