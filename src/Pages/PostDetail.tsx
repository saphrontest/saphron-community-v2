import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { getPostComments, getPostDetails } from '../Helpers/apiFunctions'
import { useNavigate, useParams } from 'react-router-dom'
import { IPost, Comment, Community } from '../Interface'
import { About, Meta, PostItem } from '../Components'
import { firestore, storage } from '../firebaseClient'
import { deleteObject, ref } from 'firebase/storage'
import { deleteDoc, doc } from 'firebase/firestore'
import { Comments } from '../Components/Posts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Flex, useToast } from '@chakra-ui/react'
import { setModal } from '../redux/slices/modalSlice'
import { setSelectedCommunity } from '../redux/slices/communitySlice'

const PostDetail = () => {
  const { slug } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [post, setPost] = useState<IPost | null>(null)
  const [comments, setComments] = useState<(Comment | null)[]>()
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [isVoteChange, setVoteChange] = useState<boolean>(false)
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

  useEffect(() => {
    slug && getPost(slug as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    post?.id && getComments(post.id as string)
  }, [post])

  useEffect(() => {
    if (isVoteChange) {
      getComments(post?.id as string)
      getPost(slug as string)
      return () => setVoteChange(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoteChange])

  useEffect(() => {
    if (post?.communityId) {
      const postCommunity = communities.find((community: Community) => community.id === post.communityId)
      dispatch(setSelectedCommunity(postCommunity as Community))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  const handleDelete = async (post: IPost): Promise<boolean> => {

    if (!user?.id) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true
      })
      dispatch(setModal({ isOpen: true, view: 'login' }))
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
      navigate("/community")
    }
  }

  return (
    <PageLayout>
      <Flex direction="column" pb="1rem">
        <Meta
          title={`Saphron Health | ${post?.title}`}
          description={post?.body as string}
        />
        {!isPageLoading && <PostItem setVoteChange={setVoteChange} post={post} isDeleteLoading={isDeleteLoading} handleDelete={handleDelete} communityName={communities.filter((c: Community) => post.communityId === c.id)[0]?.name} />}
        {!isPageLoading && <Comments comments={comments} post={post} getComments={getComments} />}
      </Flex>
      <>
        {!isPageLoading && <About communityId={communities.filter((community: Community) => community.id === post?.communityId)[0]?.id as string ?? ""} />}
      </>
    </PageLayout>
  )
}

export default PostDetail