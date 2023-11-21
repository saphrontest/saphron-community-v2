import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Box, Flex, Image, useToast } from '@chakra-ui/react'
import { getPexelPhoto } from '../pexelsClient'
import Cover from "../assets/images/cover.jpeg"
import { Nav, PostItem } from '../Components'
import { ProfileHeader } from '../Components/Profile'
import { getPostsByUsername } from '../Helpers/apiFunctions'
import { auth, firestore, storage } from '../firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Post } from '../Interface/PostInterface'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { deleteObject, ref } from 'firebase/storage'
import { deleteDoc, doc } from 'firebase/firestore'
import { Community } from '../Interface/CommunityInterface'
import { RootState } from '../redux/store'


const Profile = () => {
  const [user] = useAuthState(auth)
  const dispatch = useDispatch()
  const toast = useToast()

  const [voteChange, setVoteChange] = useState<boolean>(false)
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [userPosts, setUserPosts] = useState<Post[]>()

  const {communities} = useSelector((state: RootState) => state.community)


  const [coverPhoto, setCoverPhoto] = useState<any>()
  const [profilePhoto, setProfilePhoto] = useState<any>()

  const getCoverPhoto = async () => {
    const photo = await getPexelPhoto("cover photo about menthal health")
    setCoverPhoto(photo)
  }

  const getProfilePhoto = async () => {
    const image = await getPexelPhoto("profile picture")
    setProfilePhoto(image?.src?.original as string)
  }

  const getPosts = async (displayName: string) => {
    const posts = await getPostsByUsername(displayName)
    setUserPosts(posts)
  }

  const handleDelete = async (post: Post): Promise<boolean> => {
    if (!user?.uid) {
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
        getPosts(user?.email?.split("@")[0] as string)
      }
  }

  useEffect(() => {
    getProfilePhoto()
    getCoverPhoto()
  }, [])

  useEffect(() => {
    user?.email && getPosts(user?.email?.split("@")[0] as string)
  }, [user])
  
  useEffect(() => {
    user?.email && getPosts(user?.email?.split("@")[0] as string)
  }, [voteChange])

  return (
    <>
      <Nav />
      <ProfileHeader name={user?.displayName as string} username={user?.email?.split("@")[0] as string}/>
      <Flex justify={"center"} pt={1}>
        <PageLayout isNav={false}>
          <>
          {userPosts && userPosts.map(post => <PostItem
            key={post.id}
            post={post}
            handleDelete={handleDelete}
            isDeleteLoading={isDeleteLoading}
            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
            setVoteChange={setVoteChange}
          />)}
          </>
          <></>
        </PageLayout>
      </Flex>
    </>
  )
}

export default Profile