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
        <Tabs isLazy={true}>
            <TabList>
                {tabs.map(({name, id}) => (
                    <Tab key={id}>
                        <Text fontWeight={500}>{name}</Text>
                    </Tab>
                ))}
            </TabList>
            <TabPanels>
                {tabs.map(({component, id}) => <TabPanel key={id}>{component}</TabPanel>)}
            </TabPanels>
        </Tabs>
    )
}

export default AdminTabs
