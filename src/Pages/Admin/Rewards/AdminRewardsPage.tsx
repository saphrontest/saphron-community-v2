import { PlatformAdminContentLayout, PlatformAdminPageLayout } from '../../../Layouts'
import { Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBoolean } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';
import { NewItemModal } from '../../../Components';
import RewardActionItems from './RewardActionItems';
import RewardItems from './RewardItems';

const AdminRewardsPage = () => {

    const [newItemModal, {toggle: toggleNewItemModal}] = useBoolean(false)
    const [reloadItems, {toggle: toggleReload}] = useBoolean(false)
    
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
                                <RewardActionItems />
                            </TabPanel>
                            <TabPanel>
                                <Flex direction="column">
                                    <Flex w="100%" justify="flex-end">
                                        <Button gap="1rem" onClick={() => toggleNewItemModal()}>
                                            <AddIcon /> 
                                            <Text>
                                                New Item
                                            </Text>
                                        </Button>
                                    </Flex>
                                    <RewardItems reloadItems={reloadItems} toggleReload={toggleReload} />
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </PlatformAdminContentLayout>
            </PlatformAdminPageLayout>
            <NewItemModal
                isOpen={newItemModal}
                setOpen={toggleNewItemModal}
                reloadItems={toggleReload}
            />
        </>
    )

}

export default AdminRewardsPage
