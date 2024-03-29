import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { IPost } from "../../../Interface";
import SearchResults from "./SearchResults";
import { usePost } from "../../../Hooks";

const SearchInput = () => {
  const {searchPost} = usePost() 
  const [searchKey, setSearchKey] = useState("")
  const [searchResults, setSearchResults] = useState<IPost[]>([])
  const [inputFocus, setInputFocus] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPost(searchKey)
        .then(result => result && setSearchResults(result))
    }, 1000);
    return () => clearTimeout(timer)
  }, [searchKey])

  return (
    <Flex flexDirection="column" align="center" flexGrow={1} mr={2} maxWidth="600px">
      <Flex width="calc(100% - 16px)">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
          >
            <SearchIcon mb={2} />
          </InputLeftElement>
          <Input
            placeholder="Search..."
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
            onChange={e => setSearchKey(e.target.value)}
            onFocus={e => setInputFocus(true)}
            onBlur={e => {
              const timeout = setTimeout(() => setInputFocus(false), 300)
              return () => clearTimeout(timeout)
            }}
          />
        </InputGroup>
      </Flex>
      {inputFocus && <SearchResults searchResults={searchResults} showMoreButton={true}/>}
    </Flex>
  )
}

export default SearchInput