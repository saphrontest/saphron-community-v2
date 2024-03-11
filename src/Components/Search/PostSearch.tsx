
import { Flex } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react'
import SearchResults from '../Nav/Partials/SearchResults';
import { SearchHeader, SearchInput } from './Partials';
import { usePost } from '../../Hooks';

interface PostSearchProps {
  searchKey?: string;
  items?: any;
}

const PostSearch: FC<PostSearchProps> = ({ searchKey, items }) => {
  
  const {searchPost} = usePost() 
  
  const [searchText, setSearchText] = useState(searchKey)
  const [searchResult, setSearchResult] = useState(items)

  // TODO: clear search results when the search text is empty
  // TODO: create a no-search-result component

  useEffect(() => {
    if (searchText) {
      const timer = setTimeout(() => {
        searchPost(searchText)
          .then((result: any) => result && setSearchResult(result))
      }, 1000);
      return () => clearTimeout(timer)
    }
  }, [searchText])

  return (
    <Flex p="1" width={"100%"} direction="column">
      <SearchHeader title='Search in posts' description='You can search for previously published questions.' />
      <SearchInput text={searchText} setText={setSearchText} />
      <SearchResults showMoreButton={false} searchResults={searchResult || []} zIndex={3} />
    </Flex>
  )
}

export default PostSearch