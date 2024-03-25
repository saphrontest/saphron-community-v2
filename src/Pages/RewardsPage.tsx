import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Image, Text } from '@chakra-ui/react'
import { useReward } from '../Hooks'
import { IRewardHistoryItem, IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { ProductPriceLabel } from '../Components'

const RewardsPage = () => {
    const {getRewardHistory} = useReward()
    const user: IUser = useSelector((state: RootState) => state.user)
    const [historyItems, setHistoryItems] = useState<IRewardHistoryItem[]>([])

    useEffect(() => {
        getRewardHistory(user.id)
            .then(result => result && setHistoryItems(result))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <PageLayout leftWidth='100%'>
        <Flex bg="white" p="1rem" direction="column" align="flex-start" gap="1rem">
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
                    >
                        <Flex gap="1rem">
                            {item.img && <Image src={item.img} w="100px" h="50px" borderRadius="0.5rem"/>}
                            <Flex direction="column" align="flex-start">
                                {item.name ? (
                                    <Text fontWeight="700">
                                        {item.name}
                                    </Text>
                                ) : (
                                    <Text>
                                        {item.platform}<strong>.{item.slug}</strong>
                                    </Text>
                                )}
                                <Text color="gray">
                                    #{item.id}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex  direction="column"align="flex-end">
                            <Text>
                                12.12.2024
                            </Text>
                            <ProductPriceLabel
                                price={item.type === "income" ? item.price : -item.price}
                            />
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
        <></>
    </PageLayout>
  )
}

export default RewardsPage
