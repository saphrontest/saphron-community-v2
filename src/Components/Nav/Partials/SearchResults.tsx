import { Flex } from '@chakra-ui/react'
import { FC } from 'react'
import SearchResultsItem from './SearchResultsItem';
import { Post } from '../../../Interface/PostInterface';

interface SearchResultsProps {
    searchResults: Post[];
}

const SearchResults: FC<SearchResultsProps> = ({searchResults}) => {
  return (
    <Flex bg={"white"} p={2} zIndex={1} width={"100%"} border="1px solid" borderColor={"gray.50"} flexDirection={"column"} gap={2}>
        {searchResults.map((res, idx) => <SearchResultsItem key={idx} item={res}/>)}
    </Flex>
  )
}

export default SearchResults