import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { getPostComments, getPostDetails } from '../Helpers/apiFunctions'
import { useParams } from 'react-router-dom'
import { IPost, Comment, Community } from '../Interface'
import { About, Meta, PostItem } from '../Components'
import { Comments } from '../Components/Posts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Flex } from '@chakra-ui/react'
import { setSelectedCommunity } from '../redux/slices/communitySlice'

const PostDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const [post, setPost] = useState<IPost | null>(null)
  const [comments, setComments] = useState<(Comment | null)[]>()
  const [reloadPost, setReloadPost] = useState<boolean>(false)
  const { communities } = useSelector((state: RootState) => state.community)
  const isPageLoading = !(!!post && !!comments)

  const getPost = async (slug: string) => {
    const postDetail = await getPostDetails(slug)
    setPost(postDetail as IPost)
  }

  const getComments = async (id: string) => {
    const commentsData = await getPostComments(id)
    setComments(commentsData)
  }

  const getAll = async () => {
    getComments(post?.id as string)
    getPost(slug as string)
  }

  useEffect(() => {
    slug && getPost(slug as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    post?.id && getComments(post.id as string)
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