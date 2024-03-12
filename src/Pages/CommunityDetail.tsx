import React, { useEffect, useRef, useState } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import { Community, IPost, IUser } from '../Interface'
import { PageLayout } from '../Layouts'
import { getCommunityDetail, getPostsByCommunities } from '../Helpers/apiFunctions'
import { About, CreatePostLink, Meta, NoEntry, PostItem } from '../Components'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { usePost } from '../Hooks'

const CommunityDetail = () => {

  const data = useLoaderData()
  const location = useLocation()
  const {getSavedPostsByUser} = usePost()
  const communityId = useRef(location.pathname.split('/').at(-1)).current
  
  const { communities } = useSelector((state: RootState) => state.community)
  const user: IUser = useSelector((state: RootState) => state.user)
  
  const [posts, setPosts] = useState<IPost[]>([])
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])
  const [community, setCommunity] = useState<Community>(data as Community)
  const [reloadPost, setReloadPost] = useState<boolean>(false)

  const getDetail = async (id: string) => {
    const com = await getCommunityDetail(id)
    setCommunity(com)
  }

  const getPosts = async (id: string) => {
    const p = await getPostsByCommunities(id)
    setPosts(p)
  }

  const getSavedPosts = async (userId: string) => {
    const saved = await getSavedPostsByUser(userId)
    setSavedPosts(saved)
  }

  const getAll = async (communityId: string) => {
    try {
      await getDetail(communityId)
      await getPosts(communityId)
      await getSavedPosts(user.id)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(community) {
      getPosts(community.id)
      getSavedPosts(user.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community])

  useEffect(() => {
    if (reloadPost && communityId) {
    getAll(communityId)
      .finally(() => setReloadPost(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPost])

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
      <>
        {community && <About communityId={community.id} community={community} />}
      </>
    </PageLayout>
  )
}

export default CommunityDetail