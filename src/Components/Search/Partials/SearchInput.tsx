import { SearchIcon } from '@chakra-ui/icons'
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react'
import { FC } from 'react'

const SearchInput: FC<{text: string | undefined; setText: (text: string) => void}> = ({text, setText}) => {
    return (
        <InputGroup width={"100%"}>
            <InputLeftElement
                pointerEvents="none"
                color="gray.400"
            >
                <SearchIcon mb={2} />
            </InputLeftElement>
            <Input
                placeholder={text ?? "Search..."}
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
                onChange={e => setText(e.target.value)}
            />
        </InputGroup>
    )
}

export default SearchInput