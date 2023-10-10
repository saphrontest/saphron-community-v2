import { Flex, useToast } from '@chakra-ui/react'
import { CreatePostForm, Tabs } from './Partials'
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Community } from '../../Interface/CommunityInterface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseClient';

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
  const toast = useToast()
  const [user] = useAuthState(auth)
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const {selectedCommunity} = useSelector((state: RootState) => state.community)

  useEffect(() => {
    if(!!user === false) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  
  useEffect(() => {
    if(!selectedCommunity && !!user){
      toast({
        title: "Please select a community, first!",
        status: "error",
        isClosable: true,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommunity])

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={formTabs} />
      </Flex>
      <Flex p={4}>
        <CreatePostForm selectedTab={selectedTab} setSelectedTab={setSelectedTab} community={selectedCommunity as Community}/>
      </Flex>
    </Flex>
  )
}

export default NewPostForm