import { Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Link } from 'react-router-dom';


const PostItem = () => {
  const userVoteValue = 1
  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={"gray.300"}
      borderRadius={4}
      cursor={"pointer"}
      _hover={{ borderColor: "gray.500" }}
      onClick={() => console.log("post detail")}
    >
      <Flex
        direction="column"
        align="center"
        bg={"gray.100"}
        p={2}
        width="40px"
        borderRadius={"3px 0px 0px 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => console.log('object')}
        />
        <Text fontSize="9pt" fontWeight={600}>
          vote status
        </Text>
        <Icon
          as={
            userVoteValue === 1
              ? IoArrowDownCircleOutline
              : IoArrowDownCircleSharp
          }
          color={userVoteValue === 1 ? "gray.400" : "#4379FF"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => console.log('object')}
        />
      </Flex>
      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px 10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            <>
              {/* <Avatar src={post.communityImageURL} boxSize={18}/> */}
              <a href="/submit">
                <Text
                  fontWeight={700}
                  _hover={{ textDecoration: "underline" }}
                  onClick={(event) => console.log('object')}
                >{`community id`}</Text>
              </a>
              <Icon as={BsDot} color="gray.500" fontSize={8} />
            </>
            <Text color="gray.500">
              Posted by u/
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600} textAlign="left">
            post title
          </Text>
          <Text fontSize="10pt" textAlign="left">post body</Text>
          <Flex justify="center" align="center" p={2}>
            post image
          </Flex>
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">post comments count</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={() => console.log('delete')}
          >
            <Spinner size="sm" />
            <>
              <Icon as={AiOutlineDelete} mr={2} />
              <Text fontSize="9pt">Delete</Text>
            </>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PostItem