import { Fragment, useEffect, useState } from 'react'
import { PlatformAdminContentLayout, PlatformAdminPageLayout } from '../../Layouts'
import { Text, useBoolean } from '@chakra-ui/react'
import { IReward, PLATFORMS } from '../../Interface';
import { RewardItem } from '../../Components';
import { useReward } from '../../Hooks';

const AdminRewardsPage = () => {

    const {getRewards} = useReward()

    const [rewards, setRewards] = useState<IReward[]>([])
    const [reloadRewards, {toggle: toggleReloadRewards}] = useBoolean(false)

    useEffect(() => {
        getRewards()
            .then(res => setRewards(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        if(reloadRewards){
            getRewards()
                .then(res => setRewards(res))
                .finally(() => toggleReloadRewards())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadRewards])

    return (
        <PlatformAdminPageLayout title='Rewards'>
            <PlatformAdminContentLayout>
                {
                    PLATFORMS.map(item => (
                        <Fragment key={item}>
                            <Text align="left" fontWeight={700} fontSize="18px" textTransform="capitalize">{item}</Text>
                            {
                                rewards.map(({ id, slug, platform, reward }: IReward) => platform === item && (
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
            </PlatformAdminContentLayout>
        </PlatformAdminPageLayout>
    )

}

export default AdminRewardsPage
