import React, { useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex } from '@chakra-ui/react'
import { Tabs } from '../Components/Posts/Partials'
import { IoSearch } from 'react-icons/io5'
import { SiSmartthings } from "react-icons/si";
import { useLocation } from 'react-router-dom'
import { PostSearch, AskAI } from '../Components/Search'

const SearchPage = () => {
    const {state: {searchKey, searchResults}} = useLocation();
    // console.log(searchKey)
    // console.log(searchResults)
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
                {view === "Post Search" ? <PostSearch searchKey={searchKey} items={searchResults}/> : <AskAI />}
            </Flex>
        </>
        <>
            <Flex bg="white" height="100%" p={2}>
                Recent Searches
            </Flex>
        </>
    </PageLayout>
  )
}

export default SearchPage