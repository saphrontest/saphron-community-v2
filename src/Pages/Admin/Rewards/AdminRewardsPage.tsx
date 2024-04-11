import { PlatformAdminContentLayout, PlatformAdminPageLayout } from '../../../Layouts'
import { Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBoolean } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';
import { NewItemModal } from '../../../Components';
import RewardActionItems from './RewardActionItems';
import { useState } from 'react';
import RewardItems from './RewardItems';

const AdminRewardsPage = () => {

    const [newItemModal, {toggle: toggleNewItemModal}] = useBoolean(false)
    const [reloadItems, {toggle: toggleReload}] = useBoolean(false)
    const [searchWord, setSearchWord] = useState<string>('')

    return (
        <>
            <PlatformAdminPageLayout title='Rewards'>
                <PlatformAdminContentLayout onSearch={(word: string) => setSearchWord(word)}>
                    <Tabs>
                        <TabList>
                            <Tab>Actions</Tab>
                            <Tab>Items</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <RewardActionItems searchWord={searchWord}/>
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
                                    <RewardItems searchWord={searchWord} reloadItems={reloadItems} toggleReload={toggleReload} />
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
