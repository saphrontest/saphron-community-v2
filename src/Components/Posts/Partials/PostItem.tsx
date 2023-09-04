import { Avatar, Flex, Icon, Image, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
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
import { Link, useNavigate } from 'react-router-dom';
import { Post, PostVote } from '../../../Interface/PostInterface';
import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebaseClient';
import { useDispatch } from 'react-redux';
import { setModal } from '../../../redux/slices/modalSlice';
import { collection, doc, writeBatch } from 'firebase/firestore';



export type PostItemContentProps = {
  post: Post;
  homePage?: boolean;
  isDeleteLoading: boolean;
  handleDelete: (post: Post) => Promise<boolean>;
  communityName: string;
};

const PostItem: FC<PostItemContentProps> = ({
  post,
  homePage,
  isDeleteLoading,
  handleDelete,
  communityName
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loadingImage, setLoadingImage] = useState(true);
  const [user] = useAuthState(auth);
  
  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    vote: number
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      dispatch(setModal({isOpen: true, view: 'login'}))
      return;
    }

    try {

      // TODO: GET USER VOTES
      // TODO: IF USER HAS VOTE FOR THIS POST => REMOVE VOTE FROM USER.VOTES && ADD NEW VOTE TO USER.VOTES && UPDATE POST VOTE STATUS
      // TODO: IF NOT => ADD NEW VOTE TO USER.VOTES && UPDATE POST VOTE STATUS

    } catch (error) {
      console.log("onVote error", error);
    }
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={"gray.300"}
      borderRadius={4}
      cursor={"pointer"}
      _hover={{ borderColor: "gray.500" }}
      onClick={() => navigate(`/post/${post.id}`)}
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
            true ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={true ? "brand.100" : "gray.400"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => onVote(event, 1)}
        />
        <Text fontSize="9pt" fontWeight={600}>
          {post.voteStatus}
        </Text>
        <Icon
          as={
            true
              ? IoArrowDownCircleOutline
              : IoArrowDownCircleSharp
          }
          color={true ? "gray.400" : "#4379FF"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => onVote(event, -1)}
        />
      </Flex>
      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px 10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
          {post.createdAt && (
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
                <>
                  <Avatar src={post.communityImageURL} boxSize={18}/>
                  <Link to={`community/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                      onClick={(event) => event.stopPropagation()}
                    >{`community/${communityName}`}</Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" fontSize={8} />
                </>
              <Text color="gray.500" textAlign={"right"}>
                Posted by u/{post.userDisplayText}{" "}
                {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
              </Text>
            </Stack>
          )}
          </Stack>
          <Text fontSize="12pt" fontWeight={600} textAlign="left">
            {post.title}
          </Text>
          <Text fontSize="10pt" textAlign={"left"}>{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                // width="80%"
                // maxWidth="500px"
                maxHeight="460px"
                src={post.imageURL}
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
                alt="Post Image"
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt" textAlign={"left"}>{post.numberOfComments}</Text>
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
            onClick={() => handleDelete(post)}
          >
            {isDeleteLoading ? <Spinner size="sm" /> : (
              <>
                <Icon as={AiOutlineDelete} mr={2} />
                <Text fontSize="9pt">Delete</Text>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PostItem