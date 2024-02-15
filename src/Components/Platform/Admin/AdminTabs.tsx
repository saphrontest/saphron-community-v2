import { Tabs, TabList, Tab, TabPanels, TabPanel, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

interface IAdminTab {
    id: number;
    name: string; 
    component: ReactNode;
}

interface IAdminTabs {
    tabs: IAdminTab[];
}

const AdminTabs: FC<IAdminTabs> = ({ tabs }) => {
    return (
        <Tabs>
            <TabList>
                {tabs.map(tab => (
                    <Tab key={tab.name}>
                        <Text fontWeight={500}>{tab.name}</Text>
                    </Tab>
                ))}
            </TabList>
            <TabPanels>
                {tabs.map(tab => <TabPanel>{tab.component}</TabPanel>)}
            </TabPanels>
        </Tabs>
    )
}

export default AdminTabs
