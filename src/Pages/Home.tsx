import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, PersonalHome, PostItem, Recommendations } from '../Components'
import {Stack} from '@chakra-ui/react'
import { Post } from '../Interface/PostInterface'
import { getPosts, getUserSavedPosts } from '../Helpers/apiFunctions'
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { auth, firestore, storage } from '../firebaseClient'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Community } from '../Interface/CommunityInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [isVoteChange, setVoteChange] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const {communities} = useSelector((state: RootState) => state.community)
  const {posts} = useSelector((state: RootState) => state.post)
  const [user] = useAuthState(auth);
  const navigate = useNavigate()

  useEffect(() => {
    user?.uid && getPostsData()
    return () => setLoading(false)
  }, [user])
  
  useEffect(() => {
    if(isVoteChange){
      getPostsData()
      return () => setVoteChange(false)
    }
  }, [isVoteChange])

  const getPostsData = () => {
    getPosts()
    getUserSavedPosts(user?.uid as string)
  }
  
  const handleDelete = async (post: Post): Promise<boolean> => {
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
    <PageLayout>
      <>
        <CreatePostLink />
        <Stack>
          {!loading && posts.map(post => <PostItem
            key={post.id}
            post={post}
            handleDelete={handleDelete}
            isDeleteLoading={isDeleteLoading}
            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
            setVoteChange={setVoteChange}
          />)}
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