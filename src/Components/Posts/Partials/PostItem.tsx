import { Flex, useToast } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Post, PostVote } from '../../../Interface/PostInterface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../redux/slices/modalSlice';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { getUserVotes} from '../../../Helpers/apiFunctions';
import { RootState } from '../../../redux/store';
import VoteComponent from './VoteComponent';
import ActionButtons from './ActionButtons';
import PostContent from './PostContent';

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
  const [user] = useAuthState(auth);
  const [userVote, setUserVote] = useState<PostVote | null>(null)
  const [isVoteLoading, setVoteLoading] = useState<boolean>(false)
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

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={"gray.300"}
      borderRadius={4}
      cursor={"pointer"}
      _hover={{ borderColor: "gray.500" }}
      mb={1}
      onClick={() => navigate(`/post/${post.slug}`)}
    >
      <VoteComponent
      userVote={userVote}
      onVote={onVote}
      post={post}
      isVoteLoading={isVoteLoading}
      />
      <Flex direction="column" width="100%">
        <PostContent
        post={post}
        communityName={communityName}
        />
        {user?.uid && <ActionButtons
        post={post}
        isSaved={isSaved}
        handleDelete={handleDelete}
        isDeleteLoading={isDeleteLoading}
        />}
      </Flex>
    </Flex>
  )
}

export default PostItem