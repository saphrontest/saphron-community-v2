import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseClient";

const SearchInput = () => {
  const [user] = useAuthState(auth);
  return (
    <Flex flexGrow={1} maxWidth={"600px"} mr={2}>
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
          width="100%"
          onClick={() => {
            // TODO: if user is not exist, show toast
          }}
        />
      </InputGroup>
    </Flex>
  )
}

export default SearchInput