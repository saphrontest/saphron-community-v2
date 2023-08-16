import React, { FC } from 'react'
import TabItemComponent from './TabItemComponent';
import { TabItemInterface } from '../../../Interface/SubmitInterfaces';

interface TabsProps {
  tabs: any;
  setSelectedTab: (tab: string) => void;
  selectedTab: string
}

const Tabs: FC<TabsProps> = ({tabs, setSelectedTab, selectedTab}) => {


  return tabs.map((item: TabItemInterface, idx: number) => (
      <TabItemComponent
        key={idx}
        item={item}
        selected={item.title === selectedTab}
        setSelectedTab={setSelectedTab}
      />
    ))
}

export default Tabs