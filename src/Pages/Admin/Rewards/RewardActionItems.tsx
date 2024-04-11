import { Flex, Text, useBoolean } from '@chakra-ui/react'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { RewardItem } from '../../../Components'
import { PLATFORMS, IReward } from '../../../Interface'
import { useReward } from '../../../Hooks'

const RewardActionItems: FC<{ searchWord: string }> = ({searchWord}) => {
  
  const { getRewards } = useReward()
  const [rewardActions, setRewardActions] = useState<IReward[]>([])
  const [reloadRewards, { toggle: toggleReloadRewards }] = useBoolean(false)

  useEffect(() => {
    getRewards()
      .then(res => setRewardActions(res))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (reloadRewards) {
        getRewards()
            .then(res => setRewardActions(res))
            .finally(() => toggleReloadRewards())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadRewards])


  return (
    <Flex gap="1rem" direction="column">
      {
        PLATFORMS.map(item => (
          <Fragment key={item}>
            <Text align="left" fontWeight={700} fontSize="18px" textTransform="capitalize">{item}</Text>
            {
              (
                rewardActions.filter(item => {
                  return item.platform.includes(searchWord || searchWord.toLowerCase()) || item.slug.includes(searchWord.toLowerCase())
                })
              ).map(({ id, slug, platform, reward }: IReward) => platform === item && (
                <Fragment key={id}>
                  <RewardItem
                    id={id}
                    slug={slug}
                    platform={platform}
                    reward={reward}
                    toggleReloadRewards={toggleReloadRewards}
                  />
                </Fragment>
              ))
            }
          </Fragment>
        ))
      }
    </Flex>
  )
}

export default RewardActionItems
