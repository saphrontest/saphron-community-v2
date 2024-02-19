import { Flex } from '@chakra-ui/react';
import AIDialog from '../AIDialog';
import { FC } from 'react';
import { AIMessageInterface } from '../../../Interface';


interface AIMessagesProps {
  messages: AIMessageInterface[]
}

const AIMessages: FC<AIMessagesProps> = ({ messages }) => {
  return (
    <Flex direction="column" width="100%" gap={"1rem"} mt={"2rem"}>
      {messages.map((message: AIMessageInterface, index: number) => {
        if (message.role === 'system') return null;

        const item = {
          date: message.date,
          from: message.from,
          text: message.content as string
        }

        return <AIDialog key={index} item={item} />
      })}
    </Flex>
  )
}

export default AIMessages