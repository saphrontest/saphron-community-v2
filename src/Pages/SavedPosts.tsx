import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Meta, NoEntry, PersonalHome, PostItem } from '../Components'
import { IPost, Community } from '../Interface'
import { firestore, storage } from '../firebaseClient'
import { Box, Text, useToast } from '@chakra-ui/react'
import { setModal } from '../redux/slices/modalSlice'
import { deleteObject, ref } from 'firebase/storage'
import { deleteDoc, doc } from 'firebase/firestore'
import { getUserSavedPosts } from '../Helpers/apiFunctions'

const SavedPosts = () => {
    const user = useSelector((state: RootState) => state.user)
    const toast = useToast()
    const dispatch = useDispatch()
    const [isDeleteLoading, setDeleteLoading] = useState(false)
    const [isVoteChange, setVoteChange] = useState(false)
    const {communities} = useSelector((state: RootState) => state.community)
    const {savedPosts} = useSelector((state: RootState) => state.post)

    useEffect(() => {

      if(!!user.id === false) {
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
              getUserSavedPosts(user?.id as string)
            }
    }

    useEffect(() => {
        if(isVoteChange) {
            getUserSavedPosts(user?.id as string)
            return () => setVoteChange(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVoteChange])

  return (
    <PageLayout>
      <>
      <Meta
          title={'Saphron Health | Saved Post'}
          description='Saved Post'
        />
        {
          savedPosts.length ? (
            <>
              <Box p="14px 0px" >
                <Text fontWeight={600} textAlign="left">Saved Posts</Text>
              </Box>
              {savedPosts.map((post: IPost, index: number) => (
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
          )
            : <NoEntry type="saved post" />
        }
      </>
      <>
        <PersonalHome />
      </>
    </PageLayout>
  )
}

export default SavedPosts