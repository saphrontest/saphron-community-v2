import { Box, Heading, Text } from '@chakra-ui/react'
import { FC } from 'react'

const SearchHeader:FC<{title: string, description: string}> = ({title, description}) => {
    return (
        <Box m={2} mt={0}>
            <Heading size={{base: "sm", md: "md"}} textAlign="left">
                {title}
            </Heading>
            <Text textAlign="left" fontSize={{base: "12px", md: "16px"}}>
                {description}
            </Text>
        </Box>
    )
}

export default SearchHeader