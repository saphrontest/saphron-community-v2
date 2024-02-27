import React, { FC } from 'react'
import TabItemComponent from './TabItemComponent';
import { TabItemInterface } from '../../../Interface';
import { Flex } from '@chakra-ui/react';

interface TabsProps {
  tabs: any;
  setSelectedTab: (tab: string) => void;
  selectedTab: string
}

const Tabs: FC<TabsProps> = ({ tabs, setSelectedTab, selectedTab }) => {


  return (
    <Flex bg="white" w="100%">
      {tabs.map((item: TabItemInterface, idx: number) => (
        <TabItemComponent
          key={idx}
          item={item}
          selected={item.title === selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ))}
    </Flex>
  )
}

export default Tabs