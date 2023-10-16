import { Avatar, Flex, Icon, Image, Skeleton, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
  IoBookmarkSharp
} from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { Post, PostVote } from '../../../Interface/PostInterface';
import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../redux/slices/modalSlice';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { getUserSavedPosts, getUserVotes, savePost } from '../../../Helpers/apiFunctions';
import { RootState } from '../../../redux/store';

export type PostItemContentProps = {
  post: Post;
  homePage?: boolean;
  isDeleteLoading: boolean;
  handleDelete: (post: Post) => Promise<boolean>;
  communityName: string;
  setVoteChange: (isChanged: boolean) => void;
};

const PostItem: FC<PostItemContentProps> = ({
  post,
  homePage,
  isDeleteLoading,
  handleDelete,
  communityName,
  setVoteChange
}) => {
  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loadingImage, setLoadingImage] = useState(true);
  const [user] = useAuthState(auth);
  const [userVote, setUserVote] = useState<PostVote | null>(null)
  const [isVoteLoading, setVoteLoading] = useState<boolean>(false)
  const [isSaveLoading, setSaveLoading] = useState(false)
  const [isSaved, setSaved] = useState(false)
  const {communities} = useSelector((state:RootState) => state.community)
  const {savedPosts} = useSelector((state:RootState) => state.post)
  
  useEffect(() => {
    getUserVotesData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(!!post === true && savedPosts.length){
      savedPosts.forEach((saved: any) => {
        if(saved.id === post.id){
          setSaved(true)
        }
      })
    }
  }, [post, savedPosts])

  const getUserVotesData = async () => {
    const data = user && await getUserVotes(user.uid)
    data ? setUserVote(data.filter(vote => vote.postId === post.id)[0] as PostVote) : setUserVote(null)
  }

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    vote: number
  ) => {
    setVoteLoading(true)
    const batch = writeBatch(firestore);
    event.stopPropagation();
    if (!user?.uid) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
      dispatch(setModal({isOpen: true, view: 'login'}))
      return;
    }
    const community = communities.filter(c => c.name === communityName)[0]
    try {
      const newVote: PostVote = {
        postId: post.id,
        communityId: community.id,
        voteValue: vote,
      };

      
      if(userVote){
        // UPDATE, IF USER HAS PREVIOUS VOTE
        const postVoteRef = doc( firestore, "users", `${user.uid}/postVotes/${userVote.id}` );

        if(userVote.voteValue === vote) {
          batch.delete(postVoteRef);
        }else{
          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }else{
        // CREATE, IF USER HAS NOT PREVIOUS VOTE
        const postVoteRef = doc(collection(firestore, "users", `${user.uid}/postVotes`));
        newVote.id= postVoteRef.id;
        batch.set(postVoteRef, newVote);
      }
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: post.voteStatus + vote });
      await batch.commit();
      setVoteChange(true)
    } catch (error) {
      console.log("onVote error", error);
    } finally {
      getUserVotesData()
      setVoteLoading(false);
    }
  };

  const handleSave = async(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if(!user?.uid){
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
      dispatch(setModal({isOpen: true, view: 'login'}))
      return;
    }

    setSaveLoading(true)
    savePost(post, user?.uid as string)
    .finally(() => {
      getUserSavedPosts(user?.uid as string)
      setSaveLoading(false)
    })
  }


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
        {isVoteLoading ? <Spinner size="sm" /> : (
          <>
            <Icon
              as={
                userVote?.voteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
              }
              color={userVote?.voteValue === 1 ? "brand.100" : "gray.400"}
              fontSize={22}
              cursor="pointer"
              onClick={(event) => onVote(event, 1)}
            />
            <Text fontSize="9pt" fontWeight={600}>
              {post.voteStatus}
            </Text>
            <Icon
              as={
                userVote?.voteValue === -1
                  ? IoArrowDownCircleSharp
                  : IoArrowDownCircleOutline
              }
              color={userVote?.voteValue === -1 ?  "#4379FF" :  "gray.400"}
              fontSize={22}
              cursor="pointer"
              onClick={(event) => onVote(event, -1)}
            />
          </>
        )}
      </Flex>
      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px 10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
          {post.createdAt && (
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
                <Flex gap={1}>
                  <Avatar src={post.communityImageURL} boxSize={18}/>
                  <Link to={`community/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                      onClick={(event) => event.stopPropagation()}
                    >{`community/${communityName}`}</Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" fontSize={8} />
                </Flex>
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
                maxHeight="460px"
                src={post.imageURL}
                display={loadingImage ? "none" : "unset"}
                onLoad={(e) => {
                  setLoadingImage(false)
                }}
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
          {/* <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex> */}
          
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={handleSave}
          >
            {isSaveLoading ? <Spinner size="sm" /> : (
              <>
                <Icon as={isSaved ? IoBookmarkSharp : IoBookmarkOutline} mr={2} />
                <Text fontSize="9pt">Save</Text>
              </>
            )}
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={(ev) => {
              ev.stopPropagation()
              handleDelete(post)
            }}
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