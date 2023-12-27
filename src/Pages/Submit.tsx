import { useState } from 'react'
import { PageLayout } from '../Layouts'
import { Box, Text } from '@chakra-ui/react'
import { NewPostForm } from '../Components'
import { CommunitySelect } from '../Components/Community'
import { useParams } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebaseClient'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const Submit = () => {
  const params = useParams()
  const [user] = useAuthState(auth)
  const [communitySelectOpen, setCommunitySelectOpen] = useState(false)
  const {communities} = useSelector((state: RootState) => state.community)
  return (
    <PageLayout maxWidth="1060px">
      <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white" mb={2}>
              <Text fontWeight={600} textAlign="left">Create a post</Text>
          </Box>
          {!!user && <CommunitySelect isOpen={communitySelectOpen} setOpen={setCommunitySelectOpen} selectedCommunityId={params.communityId ?? communities[0].id}/>}
          <NewPostForm />
      </>
      <></>
    </PageLayout>
  )
}

export default Submit