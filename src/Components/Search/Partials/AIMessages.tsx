import { Flex } from '@chakra-ui/react';
import AIDialog from '../AIDialog';
import { FC } from 'react';
import { AIMessageInterface } from '../../../Interface';


interface AIMessagesProps {
  messages: AIMessageInterface[]
}

const AIMessages: FC<AIMessagesProps> = ({ messages }) => {
  return (
    <Flex
    p="1rem"
    my="1rem"
    gap="1rem"
    width="100%"
    height={{base: "400px", md: "600px"}}
    overflow="scroll"
    direction="column"
    border="2px solid"
    borderRadius="1rem"
    borderColor="gray.300"
    >
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