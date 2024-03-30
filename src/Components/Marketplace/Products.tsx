import { Flex, Image, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useReward } from '../../Hooks'
import { IUser, IUserRewardItem } from '../../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import ProductPriceLabel from './ProductPriceLabel'
import moment from 'moment'

const Products = () => {
  const {getUserRewardItems} = useReward()
  const [products, setProducts] = useState<IUserRewardItem[]>([])

  const user: IUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    getUserRewardItems(user.id)
    .then(res => res && setProducts(res))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Flex direction="column" align="flex-start" gap="1rem" bg="white" flex="1" p="1rem" borderRadius="0.4rem">
      <Text fontSize="22px" fontWeight={700}>
        Products
      </Text>
      <Flex direction="column" w="100%" gap="1rem">
        {
          products.map(item => (
            <Flex
          key={item.id}
          padding="1rem"
          borderRadius="1rem"
          gap="1rem"
          bg="white"
          border="1px solid"
          borderColor="gray.400"
          justify="space-between"
          direction={["column", "row"]}
        >
          <Flex gap="1rem">
            {item.img && <Image src={item.img} w="100px" h="50px" borderRadius="0.5rem" />}
            <Flex direction="column" align="flex-start">
              {item.name ? (
                <Text fontWeight="700">
                  {item.name}
                </Text>
              ) : (
                <Flex>
                  <Text>
                    {item.name}
                  </Text>
                </Flex>
              )}
              <Text color="gray">
                #{item.id}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" align={["flex-start", "flex-end"]}>
            <Text>
              {moment(item.createdAt).format("DD.MM.YYYY")}
            </Text>
            <ProductPriceLabel
              price={item.price}
            />
          </Flex>
        </Flex>
          ))
        }
      </Flex>
    </Flex>
  )
}

export default Products
