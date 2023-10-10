import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { getPostComments, getPostDetails } from '../Helpers/apiFunctions'
import { useNavigate, useParams } from 'react-router-dom'
import { Post } from '../Interface/PostInterface'
import { About, PostItem } from '../Components'
import { firestore, storage } from '../firebaseClient'
import { deleteObject, ref } from 'firebase/storage'
import { deleteDoc, doc } from 'firebase/firestore'
import { Comments } from '../Components/Posts'
import { Comment } from '../Interface/CommentsInterface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Community } from '../Interface/CommunityInterface'

const PostDetail = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<(Comment | null)[]>()
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [isVoteChange, setVoteChange] = useState<boolean>(false)
  const {communities} = useSelector((state: RootState) => state.community)
  const isPageLoading = !(!!post && !!comments)

  const getPost = async (id: string) => {
    const postDetail = await getPostDetails(id)
    setPost(postDetail)
  }

  const getComments = async (id: string) => {
    const commentsData = await getPostComments(id)
    setComments(commentsData)
  }

  const getDetail = async () => {
    getPost(id as string)
    getComments(id as string)
  }

  useEffect(() => {
    getDetail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(isVoteChange){
      getDetail()
      return () => setVoteChange(false)
    }
  }, [isVoteChange])

  const handleDelete = async (post: Post): Promise<boolean> => {
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
      navigate("/")
    }
}

  return (
    <PageLayout>
      <>
        {!isPageLoading && <PostItem setVoteChange={setVoteChange} post={post} isDeleteLoading={isDeleteLoading} handleDelete={handleDelete} communityName={communities.filter((c: Community) => post.communityId === c.id)[0]?.name}/>}
        {!isPageLoading && <Comments comments={comments} post={post} getComments={getComments}/>}
      </>
      <>
        <About communityId={communities.filter(({id}) => id === post?.communityId)[0]?.id as string ?? ""}/>
      </>
    </PageLayout>
  )
}

export default PostDetail