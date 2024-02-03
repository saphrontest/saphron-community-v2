import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Stack, useToast } from '@chakra-ui/react'
import { MyCommunities, Nav, NoEntry, PostItem } from '../Components'
import { ProfileHeader } from '../Components/Profile'
import { getPostsByUser } from '../Helpers/apiFunctions'
import { firestore, storage } from '../firebaseClient'
import { Post } from '../Interface/PostInterface'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { deleteObject, ref } from 'firebase/storage'
import { deleteDoc, doc } from 'firebase/firestore'
import { Community } from '../Interface/CommunityInterface'
import { RootState } from '../redux/store'
import NotFoundUserPic from '../assets/images/user.png'

const Profile = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  
  const user = useSelector((state: RootState) => state.user)
  const {communities} = useSelector((state: RootState) => state.community)

  const [voteChange, setVoteChange] = useState<boolean>(false)
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [userPosts, setUserPosts] = useState<Post[]>()


  const getPosts = async (userId: string) => {
    const posts = await getPostsByUser(userId)
    setUserPosts(posts)
  }

  const handleDelete = async (post: Post): Promise<boolean> => {
    if (!!user.id === false) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
      dispatch(setModal({isOpen: true, view: 'login'}))
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
        getPosts(user?.id as string)
      }
  }
  
  useEffect(() => {
    !!user.username && getPosts(user.id)
  }, [user])
  
  useEffect(() => {
    voteChange && getPosts(user.id)
  }, [voteChange])

  return (
    <>
      <Nav />
      <ProfileHeader
      isEmailVerified={user?.emailVerified}
      name={user?.displayName}
      username={user.username}
      profilePhoto={user?.profilePhotoURL ?? NotFoundUserPic}
      email={user?.email} coverPhoto={user.coverPhotoURL}
      />
      <PageLayout isNav={false} leftWidth='100%'>
        <>
        <Stack>
        {userPosts?.length ? userPosts.map((post: Post) => 
          <PostItem
            key={post.id}
            post={post}
            handleDelete={handleDelete}
            isDeleteLoading={isDeleteLoading}
            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
            setVoteChange={setVoteChange}
          />
        ) : <NoEntry type="post"/>}
        </Stack>
        </>
        <>
          <MyCommunities />
        </>
      </PageLayout>
    </>
  )
}

export default Profile