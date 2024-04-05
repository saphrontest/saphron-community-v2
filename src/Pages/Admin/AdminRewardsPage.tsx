import { Fragment, useEffect, useState } from 'react'
import { PlatformAdminContentLayout, PlatformAdminPageLayout } from '../../Layouts'
import { Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBoolean } from '@chakra-ui/react'
import { IReward, PLATFORMS } from '../../Interface';
import { NewItemModal, RewardItem } from '../../Components';
import { useReward } from '../../Hooks';
import { AddIcon } from '@chakra-ui/icons';

const AdminRewardsPage = () => {

    const { getRewards } = useReward()

    const [rewards, setRewards] = useState<IReward[]>([])
    const [reloadRewards, { toggle: toggleReloadRewards }] = useBoolean(false)
    const [newItemModal, { toggle: toggleNewItemModal }] = useBoolean(false)

    useEffect(() => {
        getRewards()
            .then(res => setRewards(res))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (reloadRewards) {
            getRewards()
                .then(res => setRewards(res))
                .finally(() => toggleReloadRewards())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadRewards])

    return (
        <>
            <PlatformAdminPageLayout title='Rewards'>
                <PlatformAdminContentLayout>
                    <Tabs>
                        <TabList>
                            <Tab>Actions</Tab>
                            <Tab>Items</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Flex gap="1rem" direction="column">
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
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Flex>
                                    <Flex w="100%" justify="flex-end">
                                        <Button gap="1rem" onClick={() => toggleNewItemModal()}>
                                            <AddIcon /> 
                                            <Text>
                                                New Item
                                            </Text>
                                        </Button>
                                    </Flex>
                                    <Flex>
                                        
                                    </Flex>
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </PlatformAdminContentLayout>
            </PlatformAdminPageLayout>
            <NewItemModal isOpen={newItemModal} setOpen={toggleNewItemModal}/>
        </>
    )

}

export default AdminRewardsPage
