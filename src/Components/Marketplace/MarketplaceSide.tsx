import { Flex, Button, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const MarketplaceSide = () => {
    const navigate = useNavigate()
    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            border="1px solid"
            borderColor="gray.300"
            mt={3}
            align="flex-start"
            p="1rem"
        >
            <Text fontWeight="700">
                Saphron Store
            </Text>
            <Text align="left">
                Lorem ipsum dolor sit amet
                <br />
                consectetur adipisicing elit.
            </Text>
            <Button height="30px" width="100%" mt="1rem" onClick={() => navigate("/marketplace")}>
                Go Marketplace
            </Button>
        </Flex>
    )
}

export default MarketplaceSide
