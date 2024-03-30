import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Box, Flex } from '@chakra-ui/react'
import { Meta, NewPostForm } from '../Components'
import { CommunitySelect } from '../Components/Community'
import { useLocation, useParams } from 'react-router-dom'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { Tabs } from '../Components/Posts/Partials'
import { FiEdit } from "react-icons/fi";
import { SiSmartthings } from 'react-icons/si'
import { AskAI } from '../Components/Search'


const Submit = () => {
  const params = useParams()
  const location = useLocation()
  const user = useSelector((state: RootState) => state.user)
  const [view, setView] = useState<'New Post' | 'AI Search'>("New Post")
  const { joinedCommunities } = useSelector((state: RootState) => state.community)

  useEffect(() => {
    location.state?.activeTab && setView(location.state?.activeTab)
  }, [location.state])

  const searchTabs = [
    { title: "New Post", icon: FiEdit },
    { title: "AI Search", icon: SiSmartthings }
  ];

  return (
    <PageLayout maxWidth="1060px">
      <>
        <Meta
          title={`Saphron Health | New Post`}
          description="Create a Post"
        />
        <Tabs
          tabs={searchTabs}
          setSelectedTab={(tab: string)  => setView(tab as 'New Post' | 'AI Search')}
          selectedTab={view}
        />
        {
          view === "New Post" ? (
            <Box bg="gray.50" p="1rem">
              <Box w="100%" textAlign="left">
                {!!user && <CommunitySelect selectedCommunityId={params.communityId ?? joinedCommunities[0]?.communityId} />}
              </Box>
              <NewPostForm selectedCommunityId={params.communityId ?? joinedCommunities[0]?.communityId} />
            </Box>
          ) : (
            <Flex bg="gray.50" p="1rem">
              <AskAI />
            </Flex>
          )
        }
      </>
      <></>
    </PageLayout>
  )
}

export default Submit