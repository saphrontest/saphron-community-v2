import { FC } from 'react'
import { Flex, Text } from '@chakra-ui/react';
import moment from 'moment';

interface AIDialogItem {
  text: string;
  from: string;
  date: string;
}

interface AIDialogItemProps {
  item: AIDialogItem;
}

const AIDialog: FC<AIDialogItemProps> = ({ item }) => {
  const isUser = item.from === "user"
  return (
    <Flex
      minH="45px"
      width="100%"
      p="1rem 2rem"
      direction="column"
      borderRadius="1rem"
      bg={isUser ? "gray.100" : "blue.200"}
    >
      <Text
        fontWeight={600}
        color={"gray.700"}
        textAlign={isUser ? "left" : "right"}
      >
        {item.text}
      </Text>
      <Text textAlign={!isUser ? "left" : "right"}>
        {moment(item.date, "DD.MM.YYYY HH:mm:ss").fromNow()}
      </Text>
    </Flex>
  )
}

export default AIDialog