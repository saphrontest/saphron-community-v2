import { FC } from 'react'
import { Box, Button, Divider, Flex, Image, Text, useBoolean, useMediaQuery } from '@chakra-ui/react';
import ProductPriceLabel from './ProductPriceLabel';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import moment from 'moment';

interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  img: string;
}

const Desktop: FC<{ item: IProduct; isActive: boolean; onClick: () => void; }> = ({
  item, isActive, onClick
}) => {

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
            <ProductPriceLabel price={item.price} />
          </Flex>
        </Flex>
      </Flex>
  )

}

const Mobile:FC<{ item: IProduct; buyItem: (item: IProduct) => Promise<void>; }> = ({ item, buyItem }) => {
  const [isClicked, {toggle: toggleIsClicked}] = useBoolean(false)
  return (
    <Flex direction="column" w="100%" justify="space-between" align="flex-start" cursor="pointer" bg="gray.100" borderRadius="1rem" p="1rem" onClick={toggleIsClicked}>
      <Flex direction="row" align="center" w="100%" justify="space-between">
        <Flex direction="row" align="center">
          <Image src={item.img} w="5rem" h="3rem" mr="1rem" borderRadius="0.2rem" />
          <Box>
            <Text textAlign="left" fontWeight="600" fontSize={["12", "18"]} noOfLines={2}>{item.name}</Text>
          </Box>
        </Flex>
        {!isClicked ? <MdKeyboardArrowDown size={24} /> : <MdKeyboardArrowUp size={24} />}
      </Flex>
      {isClicked ? (
        <Flex direction="column" w="100%" align="flex-start" gap="1rem" p="1rem" onClick={ev => ev.stopPropagation()}>
          <Divider borderColor="gray" />
          <Box>
            <Text textAlign="left" fontStyle="italic" fontSize={["12", "16"]}>{item.description}</Text>
          </Box>
          <Flex width="100%" justify="flex-end">
            <Button onClick={() => buyItem(item)}>
              Buy
            </Button>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  )
}

const ProductItem:FC<{ item: IProduct; isActive: boolean; onClick: () => void; buyItem: (item: IProduct) => Promise<void>; }> = ({ item, isActive, onClick, buyItem }) => {
  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
  return isSmallerThan766 ? <Mobile item={item} buyItem={buyItem}/> : <Desktop item={item} isActive={isActive} onClick={onClick}/>
}

export default ProductItem
