import { Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { GiSevenPointedStar } from "react-icons/gi";

const ProductPriceLabel: React.FC<{ price: number; }> = ({ price }) => {
    return (
        <Flex align="center" gap="0.4rem" bg="white" w="fit-content" h="fit-content" p="0.2rem 0.4rem" borderRadius="99px" color='black'>
            <Text fontWeight="600">
                {price}
            </Text>
            <GiSevenPointedStar />
        </Flex>
    )
}

export default ProductPriceLabel
