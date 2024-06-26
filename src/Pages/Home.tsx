import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, MarketplaceSide, MembershipSide, Meta, NoEntry, PersonalHome, PostItem, Recommendations, TaskTrackerSide } from '../Components'
import { Stack } from '@chakra-ui/react'
import { IPost, Community } from '../Interface'
import {  } from '../Helpers/apiFunctions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { usePost } from '../Hooks'

const Home = () => {
  const {getPosts, getSavedPostsByUser} = usePost()
  
  const [posts, setPosts] = useState<IPost[]>([])
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])
  const [reloadPost, setReloadPost] = useState<boolean>(false)
  
  const user = useSelector((state: RootState) => state.user)
  const {communities} = useSelector((state: RootState) => state.community)

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
    
    getPosts()
      .then((result: IPost[]) => setPosts(result))
    
    if(user.id) {
      getSavedPostsByUser(user.id)
        .then((result: any) => setSavedPosts(result))
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
          {posts.length ? posts.map((post: IPost) => (
            <PostItem
            key={post.id}
            post={post}
            setReloadPost={setReloadPost}
            isSaved={savedPosts.some((item: IPost) => item.id === post.id)}
            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
            />
          )) : <NoEntry type="post"/>}
        </Stack>
      </>
      <>
        <PersonalHome />
        <Recommendations />
        <MarketplaceSide />
        <MembershipSide />
        <TaskTrackerSide />
      </>
    </PageLayout>
  )
}

export default Home