import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import SearchResultsItem from './SearchResultsItem';
import { Post } from '../../../Interface/PostInterface';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  searchResults: Post[];
  searchKey?: string;
  showMoreButton?: boolean;
  zIndex?: number;
}

const SearchResults: FC<SearchResultsProps> = ({searchResults, searchKey, showMoreButton=true, zIndex=9}) => {
  const navigate = useNavigate()
  return (
    <Flex bg={"white"} p={2} zIndex={zIndex} width={"100%"} border="1px solid" borderColor={"gray.50"} flexDirection={"column"} gap={2}>
        {searchResults.map((res, idx) => <SearchResultsItem key={idx} item={res}/>)}
        {showMoreButton && <Text fontWeight={600} textAlign={"right"} cursor="pointer" onClick={() => navigate("/search", {state: {searchKey, searchResults}})}>
          Show More...
        </Text>}
    </Flex>
  )
}

export default SearchResults