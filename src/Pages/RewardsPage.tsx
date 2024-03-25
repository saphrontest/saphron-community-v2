import React, { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Text } from '@chakra-ui/react'
import { useReward } from '../Hooks'
import { IRewardHistoryExpenseItem, IRewardHistoryIncomeItem, IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const RewardsPage = () => {
    const {getRewardHistory} = useReward()
    const user: IUser = useSelector((state: RootState) => state.user)
    const [historyItems, setHistoryItems] = useState<(IRewardHistoryIncomeItem | IRewardHistoryExpenseItem)[]>([])

    useEffect(() => {
        getRewardHistory(user.id)
            .then(result => {
                result && setHistoryItems(result)
                console.log(result)
            })
    }, [])

  return (
    <PageLayout leftWidth='100%'>
        <Flex bg="white" p="1rem" direction="column" align="flex-start" gap="1rem">
            <Text fontSize="22px" fontWeight={700}>
                Reward History
            </Text>
            <Flex direction="column" w="100%">
                <Flex bg="red">
                    asd
                </Flex>
            </Flex>
        </Flex>
        <></>
    </PageLayout>
  )
}

export default RewardsPage
