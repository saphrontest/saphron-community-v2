import { FC } from 'react'
import { Flex, Text } from '@chakra-ui/react';
import moment from 'moment';

interface AIDialogItemProps {
  item: { text: string; from: string, date?: string };
}

const AIDialog: FC<AIDialogItemProps> = ({item}) => {
  const isUser = item.from === "user"
  return (
    <Flex width="100%" minH="45px" bg={isUser ? "gray.100" : "blue.200"} borderRadius={"1rem"} p="1rem 2rem" direction="column">
      <Text
      textAlign={isUser ? "left" : "right"}
      color={"gray.700"}
      fontWeight={600}
      >
        {item.text} {item.from}
      </Text>
      <Text textAlign={!isUser ? "left" : "right"}>
        {moment(item.date as string, "DD.MM.YYYY hh:mm:ss").fromNow()}
      </Text>
    </Flex>
  )
}

export default AIDialog