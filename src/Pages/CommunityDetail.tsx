import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Community } from '../Interface/CommunityInterface'
import { PageLayout } from '../Layouts'
import { getCommunityDetail, getPostsByCommunities } from '../Helpers/apiFunctions'
import { Post } from '../Interface/PostInterface'
import { About, PostItem } from '../Components'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { firestore, storage } from '../firebaseClient'

const CommunityDetail = () => {
  const location = useLocation()
  const communityId = useRef(location.pathname.split('/').at(-1)).current
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [isVoteChange, setVoteChange] = useState<boolean>(false)
  const [community, setCommunity] = useState<Community>()
  const [posts, setPosts] = useState<Post[]>([])
  const {communities} = useSelector((state: RootState) => state.community)

  const getDetail = async (id: string) => {
    const com = await getCommunityDetail(id)
    setCommunity(com)
  }

  const getPosts = async (id: string) => {
    const p = await getPostsByCommunities(id)
    setPosts(p)
  }

  useEffect(() => {
    if(communityId){
      getDetail(communityId)
      getPosts(communityId)
    }
  }, [communityId])
  
  useEffect(() => {
    if(isVoteChange && communityId){
      getDetail(communityId)
      getPosts(communityId)
      return () => setVoteChange(false)
    }
  }, [isVoteChange])
  
  useEffect(() => {
      console.log(community)
      console.log(posts)
  }, [community, posts])

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
      communityId && getPosts(communityId)
    }
}
  return (
    <PageLayout>
      <>
        {posts.map(post => <PostItem
          key={post?.id}
          post={post}
          handleDelete={handleDelete}
          isDeleteLoading={isDeleteLoading}
          communityName={communities?.filter((c: Community) => post?.communityId === c.id)[0]?.name}
          setVoteChange={setVoteChange}
        />)}
      </>
      <>
          {community && <About community={community}/>}
      </>
    </PageLayout>
  )
}

export default CommunityDetail