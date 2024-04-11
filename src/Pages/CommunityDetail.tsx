import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Community, IPost, IUser } from '../Interface'
import { PageLayout } from '../Layouts'
import { About, CreatePostLink, Meta, NoEntry, PostItem } from '../Components'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { usePost, useCommunity } from '../Hooks'

const CommunityDetail = () => {
  const location = useLocation()
  const {getSavedPostsByUser} = usePost()
  const {getPostsByCommunityId, getCommunityDetailById} = useCommunity()

  const communityId = useRef(location.pathname.split('/').at(-1)).current

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

    getCommunityDetailById(communityId)
      .then(res => setCommunity(res))
    
    getPostsByCommunityId(communityId)
      .then(p => p && setPosts(p))

    if(user.id) {
      getSavedPostsByUser(user.id)
        .then(saved => setSavedPosts(saved))
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
        {posts.length ? posts.map(post => (
          <Fragment key={post?.id}>
            <PostItem
              post={post}
              isSaved={savedPosts.some(item => item.id === post.id)}
              communityName={community?.name!}
              setReloadPost={setReloadPost}
            />
          </Fragment>
        )) : (
          <NoEntry type="community post" />
        )}
      </>
      {community ? <About communityId={community.id} community={community} /> : <></>}
    </PageLayout>
  )
}

export default CommunityDetail