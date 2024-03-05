import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Meta, NoEntry, PersonalHome, PostItem } from '../Components'
import { IPost, Community } from '../Interface'
import { Box, Text, useToast } from '@chakra-ui/react'
import { setModal } from '../redux/slices/modalSlice'
import { usePost } from '../Hooks'
//TODO: WORK ON POST STATE && SAVED POSTS
const SavedPosts = () => {
    const {getSavedPostsByUser} = usePost()
    const user = useSelector((state: RootState) => state.user)
    const toast = useToast()
    const dispatch = useDispatch()
    const [reloadPost, setReloadPost] = useState(false)
    const {communities} = useSelector((state: RootState) => state.community)

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



    useEffect(() => {
        if(reloadPost) {
            getSavedPostsByUser(user?.id as string)
              .then(result => console.log(result))
              .finally(() => setReloadPost(false))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadPost])
    
    useEffect(() => {
        getSavedPostsByUser(user?.id as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <PageLayout>
      <>
      <Meta
          title={'Saphron Health | Saved Post'}
          description='Saved Post'
        />
        {/* {
          savedPosts.length ? (
            <>
              <Box p="14px 0px" >
                <Text fontWeight={600} textAlign="left">Saved Posts</Text>
              </Box>
              {savedPosts.map((post: IPost, index: number) => (
                <PostItem
                  key={index}
                  post={post}
                  communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
                  setReloadPost={setReloadPost}
                />
              ))}
            </>
          )
            : <NoEntry type="saved post" />
        } */}
      </>
      <>
        <PersonalHome />
      </>
    </PageLayout>
  )
}

export default SavedPosts