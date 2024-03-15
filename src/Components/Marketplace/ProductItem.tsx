import { FC } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react';

const ProductItem:FC<{ item: any; isActive: boolean; onClick: () => void; }> = ({ item, isActive, onClick }) => {
  return (
    <Flex
        w="180px"
        minH="250px"
        bg="gray.100"
        cursor="pointer"
        direction="column"
        borderRadius="12px"
        onClick={onClick}
        outline={isActive ? "2.5px solid" : "none"}
        outlineColor={isActive ? "blue.500" : "none"}
      >
        <Image src={item.img} borderTopLeftRadius="12px" borderTopRightRadius="12px" w="100%" height="100px"/>
        <Flex direction="column" justify="space-between" flex="1" p={"0.5rem"}>
          <Box>
            <Text align="left" noOfLines={2} fontWeight="600">
              {item.name}
            </Text>
            <Text align="left" fontWeight="700">
              {item.description}
            </Text>
          </Box>
          <Flex w="100%" justify="flex-end">
            <Box bg="white" w="fit-content" h="fit-content" p="0.2rem 0.4rem" borderRadius="99px">
              <Text fontWeight="600">
                {item.price} $
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
  )
}

export default ProductItem
