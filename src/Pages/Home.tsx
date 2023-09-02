import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, PostItem } from '../Components'
import { Stack } from '@chakra-ui/react'
import { Post } from '../Interface/PostInterface'
import { getPosts } from '../Helpers/apiFunctions'
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { firestore, storage } from '../firebaseClient'
const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const getPostsData = async () => {
    const result = await getPosts()
    setPosts(result)
  }
  useEffect(() => {
    getPostsData()
  }, [])

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
        getPostsData()
      }
  }

  return (
    <PageLayout>
      <>
        <CreatePostLink />
        <Stack>
          {posts.map((post, index) => <PostItem
            key={post.id}
            post={post}
            handleDelete={handleDelete}
            isDeleteLoading={isDeleteLoading}
          />)}
        </Stack>
      </>
      <></>
    </PageLayout>
  )
}

export default Home