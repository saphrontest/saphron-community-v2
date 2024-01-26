import { Flex } from '@chakra-ui/react';
import AIDialog from '../AIDialog';
import { FC } from 'react';

const AIMessages: FC<{
  messages: {
    date: string,
    from: string,
    content: string
  }[]
}> = ({ messages }) => {
  return (
    <Flex direction="column" width="100%" gap={"1rem"} mt={"2rem"}>
      {messages.sort((a: any, b: any): number => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }).map((message: any, index: number) => {
        if (message.role === 'system') return null;
        return (
          <AIDialog key={index} item={{ text: message.content as string, from: message.from, date: message.date }} />
        )
      })}
    </Flex>
  )
}

export default AIMessages