import React, { FC } from 'react'
import { Flex, Icon, Image, Input, useToast } from '@chakra-ui/react'
import { BsLink45Deg } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import LogoIcon from '../../assets/Logo/logo-icon.png'
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

interface CreatePostLinkProps {
  communityId?: string;
}

const CreatePostLink : FC <CreatePostLinkProps> = ({communityId}) => {
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()
  const toast = useToast()
  const handleClick = () => {
    if(user?.id) {
      navigate(`/community/submit${communityId ? `/${communityId}` : ''}`)
    } else {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
    }
  }
  return (
    <Flex
        justify="space-evenly"
        align="center"
        bg="white"
        height="56px"
        borderRadius={4}
        border="1px solid"
        borderColor="gray.300"
        onClick={handleClick}
        p={2}
        mb={4}
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
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `/community/submit${communityId ? `/${communityId}` : ''}`, {
                state: {
                  type: 'Images & Video'
                }
              }
            )
          }}
        />
        <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
      </Flex>
  )
}

export default CreatePostLink