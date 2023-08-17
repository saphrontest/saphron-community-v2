import React, { useState } from 'react'
import { PageContent } from '../Layouts'
import { Box, Text } from '@chakra-ui/react'
import { NewPostForm } from '../Components'
import { CommunitySelect } from '../Components/Community'

const Submit = () => {
  const [communitySelectOpen, setCommunitySelectOpen] = useState(false)
  return (
    <PageContent maxWidth="1060px">
      <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white" mb={2}>
              <Text fontWeight={600} textAlign="left">Create a post</Text>
          </Box>
          <CommunitySelect isOpen={communitySelectOpen} setOpen={setCommunitySelectOpen}/>
          <NewPostForm />
      </>
      <></>
    </PageContent>
  )
}

export default Submit