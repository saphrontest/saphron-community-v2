import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Box, Stack, useMediaQuery } from '@chakra-ui/react'
import { Meta, MyCommunities, Nav, NoEntry, PostItem } from '../Components'
import { ProfileHeader } from '../Components/Profile'
import { IPost, Community } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import NotFoundUserPic from '../assets/images/user.png'
import { usePost } from '../Hooks'

const Profile = () => {

  const [isSmallerThan485] = useMediaQuery('(max-width: 485px)')
  const {getPostsByUser, getSavedPostsByUser} = usePost()

  const user = useSelector((state: RootState) => state.user)
  const { communities } = useSelector((state: RootState) => state.community)

  const [reloadPost, setReloadPost] = useState<boolean>(false)
  const [userPosts, setUserPosts] = useState<IPost[]>()
  const [savedPosts, setSavedPosts] = useState<IPost[]>([])


  const getPosts = async (userId: string) => {
    const posts = await getPostsByUser(userId)
    setUserPosts(posts)
  }
  
  const getSavedPosts = async (userId: string) => {
    const saved = await getSavedPostsByUser(userId)
    setSavedPosts(saved)
  }


  useEffect(() => {
    getPosts(user.id)
    getSavedPosts(user.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    reloadPost && getPosts(user.id).finally(() => setReloadPost(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPost])

  return (
    <>
      <Meta
        title="Saphron Health | Profile"
        description="Profile Page"
      />
      <Nav />
      {!isSmallerThan485 && <ProfileHeader
        isEmailVerified={user?.emailVerified}
        name={user?.displayName}
        username={user.username}
        profilePhoto={user?.profilePhotoURL ?? NotFoundUserPic}
        email={user?.email} coverPhoto={user.coverPhotoURL}
      />}
      <PageLayout isNav={false} leftWidth='100%'>
        <>
          <Stack>
          {isSmallerThan485 && <ProfileHeader
            isEmailVerified={user?.emailVerified}
            name={user?.displayName}
            username={user.username}
            profilePhoto={user?.profilePhotoURL ?? NotFoundUserPic}
            email={user?.email} coverPhoto={user.coverPhotoURL}
          />}
            <Box>
            {userPosts?.length ? userPosts.map((post: IPost) =>
              <PostItem
                key={post.id}
                post={post}
                isSaved={savedPosts.some(item => item.id === post.id)}
                communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
                setReloadPost={setReloadPost}
              />
            ) : <NoEntry type="post" />}
            </Box>
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