import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex } from '@chakra-ui/react'
import { Tabs } from '../Components/Posts/Partials'
import { IoSearch } from 'react-icons/io5'
import { SiSmartthings } from "react-icons/si";
import { useLocation } from 'react-router-dom'
import { PostSearch, AskAI, RecentSearches } from '../Components/Search'

const SearchPage = () => {
  const location = useLocation();
  const [view, setSelectedView] = useState<"Post Search" | "AI Search">("Post Search")
  const toggleView = () => setSelectedView(prev => prev === "Post Search" ? "AI Search" : "Post Search")
  const searchTabs = [
      {
        title: "Post Search",
        icon: IoSearch,
      },
      {
        title: "AI Search",
        icon: SiSmartthings,
      }
    ];

  useEffect(() => {
    location.state?.activeTab && setSelectedView(location.state?.activeTab)
  }, [location.state.activeTab])

  return (
    <PageLayout showSidebar={false}>
        <>
            <Flex bg="white">
                <Tabs
                tabs={searchTabs}
                setSelectedTab={toggleView}
                selectedTab={view}
                />
            </Flex>
            <Flex bg="white" p="2">
                {
                  view === "Post Search" ?
                    <PostSearch
                    searchKey={location.state?.searchKey}
                    items={location.state?.searchResults}
                    /> : <AskAI />
                }
            </Flex>
        </>
        <>
          <Flex bg="white" height="100%" p={2}>
            <RecentSearches />
          </Flex>
        </>
    </PageLayout>
  )
}

export default SearchPage