import { Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import SearchResultsItem from './SearchResultsItem';
import { IPost } from '../../../Interface';
import NoEntry from '../../NoEntry';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  searchResults: IPost[];
  searchKey?: string;
  showMoreButton?: boolean;
  zIndex?: number;
}

const SearchResults: FC<SearchResultsProps> = ({searchResults, showMoreButton, searchKey}) => {
  const navigate = useNavigate()
  return !!searchResults.length ? (
    <Flex
    p={2}
    gap={2}
    w="100%"
    bg="white"
    zIndex={1}
    border="1px solid"
    borderColor="gray.50"
    flexDirection="column"
    >
        {searchResults.map((res, idx) => <SearchResultsItem key={idx} item={res}/>)}
        {showMoreButton && (
          <Text
          fontWeight={600}
          textAlign="right"
          cursor="pointer"
          onClick={() => navigate("/community/search", {state: {
            searchKey,
            searchResults
          }})}
          >
            Show More...
          </Text>
        )}
    </Flex>
  ) : <Box zIndex={9999} w="100%"><NoEntry type="result" iconSize={100}/></Box>
}

export default SearchResults