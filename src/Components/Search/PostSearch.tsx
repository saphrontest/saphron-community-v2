import { SearchIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import SearchResults from '../Nav/Partials/SearchResults';
import { searchPost } from '../../Helpers/apiFunctions';

interface PostSearchProps {
  searchKey: string;
  items: any;
}

const PostSearch:FC<PostSearchProps> = ({searchKey, items}) => {
  const [searchText, setSearchText] = useState(searchKey)
  const [searchResult, setSearchResult] = useState(items)

  // TODO: clear search results when the search text is empty
  // TODO: create a no-search-result component

  useEffect(() => {
    if(searchText){
      const timer = setTimeout(() => {
        searchPost(searchText)
          .then((result: any) => result && setSearchResult(result))
      }, 1000);
      return () => clearTimeout(timer)
    }
  }, [searchText])

  return (
    <Flex p="1" width={"100%"} direction="column">
      <Box m={2} mt={0}>
        <Heading size="md" textAlign="left">
          Search in posts
        </Heading>
        <Text textAlign="left" >
          You can search for previously published questions.
        </Text>
      </Box>
      <InputGroup width={"100%"}>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
          >
            <SearchIcon mb={2} />
          </InputLeftElement>
          <Input
            placeholder={searchText ?? "Search..."}
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              outline: "none",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            height="34px"
            bg="gray.50"
            width="100%"
            onChange={e => setSearchText(e.target.value)}
          />
        </InputGroup>
        <SearchResults showMoreButton={false} searchResults={searchResult} zIndex={3}/>
    </Flex>
  )
}

export default PostSearch