import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, Meta, NoEntry, PersonalHome, PostItem, Recommendations } from '../Components'
import { Stack } from '@chakra-ui/react'
import { IPost, Community } from '../Interface'
import { getPosts, getUserSavedPosts } from '../Helpers/apiFunctions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const Home = () => {
  const [reloadPost, setReloadPost] = useState<boolean>(false)
  const {communities} = useSelector((state: RootState) => state.community)
  const {posts} = useSelector((state: RootState) => state.post)
  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    getPostsData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if(reloadPost){
      getPostsData()
        .finally(() => setReloadPost(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPost])

  const getPostsData = async () => {
    await getPosts()
    await user?.id && getUserSavedPosts(user?.id as string)
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
            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
            setReloadPost={setReloadPost}
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