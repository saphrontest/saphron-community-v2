import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Community, IPost, IUser } from '../Interface'
import { PageLayout } from '../Layouts'
import { About, CreatePostLink, Meta, NoEntry, PostItem } from '../Components'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { usePost, useCommunity } from '../Hooks'

const CommunityDetail = () => {
  const {getPostsByCommunityId, getCommunityDetailById} = useCommunity()
  const {getSavedPostsByUser} = usePost()
  const location = useLocation()
  const communityId = useRef(location.pathname.split('/').at(-1)).current
  
  const { communities } = useSelector((state: RootState) => state.community)
  const user: IUser = useSelector((state: RootState) => state.user)
  
  const [posts, setPosts] = useState<IPost[]>([])
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])
  const [community, setCommunity] = useState<Community>()
  const [reloadPost, setReloadPost] = useState<boolean>(false)

  useEffect(() => {
    communityId && getAll(communityId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId])

  useEffect(() => {
    (reloadPost && communityId) && getAll(communityId)
        .finally(() => setReloadPost(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPost])
  
  const getAll = async (communityId: string) => {
    
    try {

      getCommunityDetailById(communityId)
        .then(res => setCommunity(res))
      
      getPostsByCommunityId(communityId)
        .then(p => p && setPosts(p))

      getSavedPostsByUser(user.id)
        .then(saved => setSavedPosts(saved))

    } catch (error) {
      console.error(error)
    }

  }



  return (
    <PageLayout>
      <>
        <Meta
          title={`Saphron Health | ${community?.name}`}
          description={community?.description as string}
        />
        <CreatePostLink communityId={communityId} />
        {posts.length ? posts.map(post => <PostItem
          isSaved={savedPosts.some(item => item.id === post.id)}
          key={post?.id}
          post={post}
          communityName={communities?.filter((c: Community) => post?.communityId === c.id)[0]?.name}
          setReloadPost={setReloadPost}
        />) : <NoEntry type="community post" />}
      </>
      {community ? <About communityId={community.id} community={community} /> : <></>}
    </PageLayout>
  )
}

export default CommunityDetail