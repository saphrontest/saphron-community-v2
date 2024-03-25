import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { useLocation, useParams } from 'react-router-dom'
import { IPost, IComment, Community } from '../Interface'
import { About, Meta, PostItem } from '../Components'
import { Comments } from '../Components/Posts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Flex } from '@chakra-ui/react'
import { setSelectedCommunity } from '../redux/slices/communitySlice'
import { useComment, usePost } from '../Hooks'

const PostDetail = () => {
  
  const dispatch = useDispatch()
  const { slugId } = useParams()
  const { getPostDetail } = usePost()
  const { getCommentByPostId } = useComment()
  const { state: locationState } = useLocation()

  const [post, setPost] = useState<IPost>()
  const [reloadPost, setReloadPost] = useState<boolean>(false)
  const [comments, setComments] = useState<IComment[]>([])

  const { communities } = useSelector((state: RootState) => state.community)
  
  const isPageLoading = !(!!post && !!comments)


  const getPost = async (slugId: string) => {
    const postDetail = await getPostDetail(slugId)
    setPost(postDetail as IPost)
  }

  const getComments = async (postId: string) => {
    const commentsData = await getCommentByPostId(postId)
    setComments(commentsData)
  }

  const getAll = async () => {
    getComments(post?.id as string)
    getPost(slugId as string)
  }

  useEffect(() => {
    slugId && getPost(slugId as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugId])

  useEffect(() => {
    post?.id && getComments(post.id as string)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  useEffect(() => {
    if (reloadPost) {
      getAll().finally(() => setReloadPost(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPost])

  useEffect(() => {
    if (post?.communityId) {
      const postCommunity = communities.find((community: Community) => community.id === post.communityId)
      dispatch(setSelectedCommunity(postCommunity as Community))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])


  return (
    <PageLayout>
      <Flex direction="column" pb="1rem">
        <Meta
          title={`Saphron Health | ${post?.title}`}
          description={post?.body as string}
        />
        {!isPageLoading && <PostItem
        isSaved={locationState.isSaved}
        post={post}
        setReloadPost={setReloadPost}
        communityName={communities.filter((c: Community) => post.communityId === c.id)[0]?.name}
        />}
        {!isPageLoading && <Comments comments={comments} post={post} getComments={getComments} />}
      </Flex>
      <>
        {!isPageLoading && <About communityId={communities.filter((community: Community) => community.id === post?.communityId)[0]?.id as string ?? ""} />}
      </>
    </PageLayout>
  )
}

export default PostDetail