import React, { FC, useEffect, useState } from 'react'
import { Community, IMembership, IPost, IUser } from '../Interface';
import { MyCommunities, NoEntry, PostItem, ProfileHeader } from '../Components';
import NotFoundUserPic from '../assets/images/user.png'
import PageLayout from './PageLayout';
import { Box, Stack, useMediaQuery } from '@chakra-ui/react';
import { usePost } from '../Hooks';

const ProfilePageLayout:FC<{
    user: IUser;
    membership?: IMembership;
    communities: Community[];
    isMine: boolean;
    savedPosts: IPost[];
}> = ({
    user,
    membership,
    communities,
    isMine,
    savedPosts
}) => {
    const { getPostsByUser } = usePost()
    const [isSmallerThan485] = useMediaQuery('(max-width: 485px)')
    
    const [posts, setPosts] = useState<IPost[]>([])
    const [reloadPost, setReloadPost] = useState<boolean>(false)

    const getPosts = async (userId: string) => {
        const posts = await getPostsByUser(userId)
        setPosts(posts)
    }

    useEffect(() => {
        reloadPost && getPosts(user.id).finally(() => setReloadPost(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadPost])

    useEffect(() => {
        if (user.id) {
            getPosts(user.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])


  return (<>
    {!isSmallerThan485 && <ProfileHeader
        isEmailVerified={user?.emailVerified}
        name={user?.displayName}
        username={user.username}
        profilePhoto={user?.profilePhotoURL ?? NotFoundUserPic}
        email={user?.email}
        coverPhoto={user.coverPhotoURL}
        membership={membership}
        isMine={isMine}
    />}
    <PageLayout isNav={false} leftWidth='100%'>
        <>
            <Stack>
                {isSmallerThan485 && <ProfileHeader
                    isEmailVerified={user?.emailVerified}
                    name={user?.displayName}
                    username={user.username}
                    profilePhoto={user?.profilePhotoURL ?? NotFoundUserPic}
                    email={user?.email}
                    coverPhoto={user.coverPhotoURL}
                    isMine={isMine}
                />}
                <Box>
                    {posts?.length ? posts.map((post: IPost) =>
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
            {isMine && <MyCommunities />}
        </>
    </PageLayout>
</>
  )
}

export default ProfilePageLayout
