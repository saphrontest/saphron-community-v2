import { Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ProductPriceLabel from './ProductPriceLabel'
import { IRewardHistoryItem, IUser } from '../../Interface'
import { useSelector } from 'react-redux'
import { useReward } from '../../Hooks'
import { RootState } from '../../redux/store'
import moment from 'moment'

const Account = () => {
  const {getRewardHistory} = useReward()

  const [historyItems, setHistoryItems] = useState<IRewardHistoryItem[]>([])

  const user: IUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
      getRewardHistory(user.id)
          .then(result => result && setHistoryItems(result))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Flex direction="column" align="flex-start" gap="1rem" bg="white" flex="1" p="1rem" borderRadius="0.4rem">
                <Text fontSize="22px" fontWeight={700}>
                    Reward History
                </Text>
                <Flex direction="column" w="100%" gap="1rem">
                    {historyItems.map(item => (
                        <Flex
                        key={item.id}
                        padding="1rem"
                        borderRadius="1rem"
                        gap="1rem"
                        bg={item.type === "income" ? "gray.100" : "white"}
                        border={item.type === "expense" ? "1px solid" : "none"}
                        borderColor="gray.400"
                        justify="space-between"
                        direction={["column", "row"]}
                        >
                            <Flex gap="1rem">
                                {item.img && <Image src={item.img} w="100px" h="50px" borderRadius="0.5rem"/>}
                                <Flex direction="column" align="flex-start">
                                    {item.name ? (
                                        <Text fontWeight="700">
                                            {item.name}
                                        </Text>
                                    ) : (
                                        <Flex>
                                            <Text>
                                                {item.platform}
                                            </Text>
                                            <Text fontWeight={700}>
                                            .{item.slug}
                                            </Text>
                                        </Flex>
                                    )}
                                    <Text color="gray">
                                        #{item.id}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex  direction="column" align={["flex-start", "flex-end"]}>
                                <Text>
                                    {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
                                </Text>
                                <ProductPriceLabel
                                    price={item.type === "income" ? item.price : -item.price}
                                />
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
  )
}

export default Account
