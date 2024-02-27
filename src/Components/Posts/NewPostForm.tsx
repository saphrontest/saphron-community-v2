import { Flex, useToast } from '@chakra-ui/react'
import { CreatePostForm, Tabs } from './Partials'
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Community } from '../../Interface';

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

interface NewPostFormPropsInterface {
  selectedCommunityId?: string;
}

const NewPostForm: FC<NewPostFormPropsInterface> = ({selectedCommunityId}) => {
  const toast = useToast()
  const user = useSelector((state: RootState) => state.user)
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const {communities} = useSelector((state: RootState) => state.community)
  const selectedCommunity = communities.find((community:Community) => community.id === selectedCommunityId)
  useEffect(() => {
    if(!!user.id === false) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  
  useEffect(() => {
    if(!selectedCommunity && !!user){
      toast({
        title: "Please select a community, first!",
        status: "error",
        isClosable: true
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