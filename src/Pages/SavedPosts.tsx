import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { PersonalHome, PostItem } from '../Components'
import { Post } from '../Interface/PostInterface'
import { Community } from '../Interface/CommunityInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore, storage } from '../firebaseClient'
import { Box, Text, useToast } from '@chakra-ui/react'
import { setModal } from '../redux/slices/modalSlice'
import { deleteObject, ref } from 'firebase/storage'
import { deleteDoc, doc } from 'firebase/firestore'
import { getUserSavedPosts } from '../Helpers/apiFunctions'

const SavedPosts = () => {
    const [user] = useAuthState(auth)
    const toast = useToast()
    const dispatch = useDispatch()
    const [isDeleteLoading, setDeleteLoading] = useState(false)
    const [isVoteChange, setVoteChange] = useState(false)
    const {communities} = useSelector((state: RootState) => state.community)
    const {savedPosts} = useSelector((state: RootState) => state.post)

    useEffect(() => {

      if(!!user === false) {
        toast({
          title: "Please login, first!",
          status: "error",
          isClosable: true,
          position: "top-right"
        })
        dispatch(setModal({isOpen: true, view: 'login'}))
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])


    const handleDelete = async (post: Post): Promise<boolean> => {
        if (!user?.uid) {
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
              getUserSavedPosts(user?.uid as string)
            }
    }

    useEffect(() => {
        if(isVoteChange) {
            getUserSavedPosts(user?.uid as string)
            return () => setVoteChange(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVoteChange])
  return (
    <PageLayout>
      <>
        <Box p="14px 0px" >
            <Text fontWeight={600} textAlign="left">Saved Posts</Text>
        </Box>
        {savedPosts.map((post: any, index) => (
        <PostItem
          key={index}
          post={post}
          handleDelete={handleDelete}
          isDeleteLoading={isDeleteLoading}
          communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
          setVoteChange={setVoteChange}
        />
        ))}
      </>
      <>
        <PersonalHome />
      </>
    </PageLayout>
  )
}

export default SavedPosts