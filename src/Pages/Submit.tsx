import { useState } from 'react'
import { PageLayout } from '../Layouts'
import { Box, Text } from '@chakra-ui/react'
import { Meta, NewPostForm } from '../Components'
import { CommunitySelect } from '../Components/Community'
import { useParams } from 'react-router-dom'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'


const Submit = () => {
  const params = useParams()
  const user = useSelector((state: RootState) => state.user)
  const [communitySelectOpen, setCommunitySelectOpen] = useState(false)
  const { joinedCommunities } = useSelector((state: RootState) => state.community)
  return (
    <PageLayout maxWidth="1060px">
      <>
        <Meta
          title={`Saphron Health | New Post`}
          description="Create a Post"
        />
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white" mb={2}>
          <Text fontWeight={600} textAlign="left">Create a post</Text>
        </Box>
        {!!user && <CommunitySelect isOpen={communitySelectOpen} setOpen={setCommunitySelectOpen} selectedCommunityId={params.communityId ?? joinedCommunities[0]?.communityId} />}
        <NewPostForm selectedCommunityId={params.communityId ?? joinedCommunities[0]?.communityId} />
      </>
      <></>
    </PageLayout>
  )
}

export default Submit