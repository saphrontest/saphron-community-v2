import React from 'react'
import { PageContent } from '../Layouts'
import { CreatePostLink, PostItem } from '../Components'
import { Stack } from '@chakra-ui/react'

const Home = () => {
  return (
    <PageContent>
      <>
        <CreatePostLink />
        <Stack>
          <PostItem />
        </Stack>
      </>
      <></>
    </PageContent>
  )
}

export default Home