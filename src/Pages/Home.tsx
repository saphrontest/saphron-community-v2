import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, Meta, NoEntry, PersonalHome, PostItem, Recommendations } from '../Components'
import {Stack, useToast} from '@chakra-ui/react'
import { IPost, Community } from '../Interface'
import { getPosts, getUserSavedPosts } from '../Helpers/apiFunctions'
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { firestore, storage } from '../firebaseClient'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setModal } from '../redux/slices/modalSlice'

const Home = () => {
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [isVoteChange, setVoteChange] = useState<boolean>(false)
  const {communities} = useSelector((state: RootState) => state.community)
  const {posts} = useSelector((state: RootState) => state.post)
  const user = useSelector((state: RootState) => state.user)
  const toast = useToast()
  const dispatch = useDispatch()

  useEffect(() => {
    getPostsData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if(isVoteChange){
      getPostsData()
        .finally(() => setVoteChange(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoteChange])

  const getPostsData = async () => {
    await getPosts()
    await user?.id && getUserSavedPosts(user?.id as string)
  }
  
  const handleDelete = async (post: IPost): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
      dispatch(setModal({isOpen: true, view: 'login'}))
      return false;
    }
      setDeleteLoading(true)
      console.log("DELETING POST: ", post.id);
  
      try {
        // if post has an image url, delete it from storage
        if (post.imageURL) {
          const imageRef = ref(storage, `posts/${post.id}/image`);
          await deleteObject(imageRef);
        }
  
        // delete post from posts collection
        const postDocRef = doc(firestore, "posts", post.id);
        await deleteDoc(postDocRef);
  
        /**
         * Cloud Function will trigger on post delete
         * to delete all comments with postId === post.id
         */
        return true;
      } catch (error) {
        console.log("THERE WAS AN ERROR", error);
        return false;
      } finally {
        setDeleteLoading(false)
        getPostsData()
      }
  }

  return (
    <PageLayout showWorkshops={true} showGroupChats={true}>
      <>
        <Meta
        title='Saphron Health | Homepage'
        description='A self-help platform for neurodivergent adults to manage their health & wellness.'
        />
        <CreatePostLink />
        <Stack>
          {posts.length ? posts.map((post: IPost) => <PostItem
            key={post.id}
            post={post}
            handleDelete={handleDelete}
            isDeleteLoading={isDeleteLoading}
            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
            setVoteChange={setVoteChange}
          />) : <NoEntry type="post"/>}
        </Stack>
      </>
      <>
        <PersonalHome />
        <Recommendations />
      </>
    </PageLayout>
  )
}

export default Home