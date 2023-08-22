import React from 'react'
import { PageLayout } from '../Layouts'
import { CreatePostLink, PostItem } from '../Components'
import { Stack } from '@chakra-ui/react'

const Home = () => {
  return (
    <PageLayout>
      <>
        <CreatePostLink />
        <Stack>
          <PostItem />
        </Stack>
      </>
      <></>
    </PageLayout>
  )
}

export default Home