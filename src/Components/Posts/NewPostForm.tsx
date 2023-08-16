import { Flex } from '@chakra-ui/react'
import { CreatePostForm, Tabs } from './Partials'
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { useState } from 'react';

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  }
];

const NewPostForm = () => {
  
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={formTabs} />
      </Flex>
      <Flex p={4}>
        <CreatePostForm selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      </Flex>
    </Flex>
  )
}

export default NewPostForm