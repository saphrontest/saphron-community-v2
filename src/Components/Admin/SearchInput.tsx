import { Box } from "@chakra-ui/react"
import { InputItem } from "../../Layouts"
import { FC } from "react"

const SearchInput:FC<{ onSearch: (searchWord: string) => void; }> = ({onSearch}) => {
    return (
        <Box pb="1rem" w={["100%", "100%", "30%"]}>
            <InputItem name='search' type='text' placeholder='Search...' onChange={ev => onSearch(ev.target.value)} />
        </Box>
    )
}

export default SearchInput
