import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Meta, NoEntry, PersonalHome, PostItem } from '../Components'
import { IPost, Community, IUser } from '../Interface'
import { Box, Text, useToast } from '@chakra-ui/react'
import { setModal } from '../redux/slices/modalSlice'
import { usePost } from '../Hooks'

const SavedPosts = () => {

  const toast = useToast()
  const dispatch = useDispatch()
  const { getSavedPostsByUser } = usePost()
  
  const user: IUser = useSelector((state: RootState) => state.user)
  const { communities } = useSelector((state: RootState) => state.community)

  const [reloadPost, setReloadPost] = useState(false)
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])

  useEffect(() => {

    if (!!user.id === false) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
      dispatch(setModal({ isOpen: true, view: 'login' }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (reloadPost) {
      getSavedPostsByUser(user.id)
        .then(result => setSavedPosts(result))
        .finally(() => setReloadPost(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPost])

  useEffect(() => {
    getSavedPostsByUser(user.id)
      .then(result => setSavedPosts(result))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                <Text fontWeight={700} fontSize="22px" textAlign="left">Saved Posts</Text>
              </Box>
              {savedPosts.map((post: IPost, index: number) => (
                <PostItem
                  isSaved={true}
                  key={index}
                  post={post}
                  communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
                  setReloadPost={setReloadPost}
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