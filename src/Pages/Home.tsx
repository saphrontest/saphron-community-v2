import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, PostItem } from '../Components'
import { Stack } from '@chakra-ui/react'
import { Post } from '../Interface/PostInterface'
import { getPosts } from '../Helpers/apiFunctions'

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  useEffect(() => {
    const get = async () => {
      const result = await getPosts()
      console.log(result)
      setPosts(result)
    }
    get()
  })

  

  return (
    <PageLayout>
      <>
        <CreatePostLink />
        <Stack>
          {/* {posts.map((post, index) => <PostItem
            key={post.id}
            post={post}
            postIdx={index}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === post.id
              )?.voteValue
            }
            userIsCreator={user?.uid === post.creatorId}
            onSelectPost={onSelectPost}
            homePage
          />)} */}
        </Stack>
      </>
      <></>
    </PageLayout>
  )
}

export default Home