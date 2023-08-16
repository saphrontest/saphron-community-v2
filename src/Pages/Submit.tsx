import React from 'react'
import { PageContent } from '../Layouts'
import { Box, Text } from '@chakra-ui/react'
import { NewPostForm } from '../Components'

const Submit = () => {
  return (
    <PageContent maxWidth="1060px">
      <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
              <Text fontWeight={600} textAlign="left">Create a post</Text>
          </Box>
          {/* <SelectCommunity isOpen={isOpen} setOpen={setOpen}/> */}
          <NewPostForm />
      </>
      <></>
    </PageContent>
  )
}

export default Submit