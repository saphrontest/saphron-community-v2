import { Box, Button, Flex, Heading, Spinner, Stack, Text, Textarea } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import AIDialog from './AIDialog'
import SuggestedQuestions from './SuggestedQuestions'
import { openai } from '../../openAIClient'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources'
import moment from 'moment'

const AskAI = () => {
  const [text, setText] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<ChatCompletionCreateParamsNonStreaming>({
    messages: [{ role: "system", content: "You are a helpful assistant."}],
    model: "gpt-3.5-turbo",
  })
  const [sendMessage, setSendMessage] = useState<boolean>(false)
  const [messages, setMessages] = useState<any>([])
  const [lastQuestion, setLastQuestion] = useState("")

  const send = async () => {
    const response = await openai.chat.completions.create(params);
    setMessages((prev: any) => ([
      ...prev,
      {
        date: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
        from: response.choices[0].message.role,
        content: response.choices[0].message.content
      }
    ]))
    setParams(prev => ({
      messages: [...prev.messages, response.choices[0].message],
      model: "gpt-3.5-turbo"
    }))
    setSendMessage(false)
    setLoading(false)
  }

  useEffect(() => {
    if(sendMessage) {
      send()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendMessage])

  const handleButton = (question: string | null = null) => {
    setLoading(true)
    setMessages((prev: any) => ([
      ...prev,
      {
        date: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
        from: 'user',
        content: question ?? text
      }
    ]))
    setParams(prev => ({
      messages: [...prev.messages, {role: 'user', content: question ?? text}],
      model: "gpt-3.5-turbo"
    }))
    setLastQuestion(question ?? text)
    setSendMessage(true)
  }
  return (
    <Flex p="1" width="100%" direction="column">
      <Box  m={2} mt={0}>
        <Heading size="md" textAlign="left">
          Ask to Saphron AI
        </Heading>
        <Text textAlign="left">
          You can ask the Saphron AI, which is developed using ChatGPT for our community members.
        </Text>
      </Box>
      <Flex direction="column" width="100%">
        <Textarea  width="100%" onChange={e => setText(e.target.value)}/>
        <Stack w={"100%"} display={"flex"} align="flex-end" pt={"1rem"}>
          <Button
            w="fit-content" 
            height="34px"
            padding="0px 30px"
            onClick={() => handleButton(null)}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Ask to Saphron AI"}
          </Button>
        </Stack>
      </Flex>
      <Flex direction="column" width="100%" gap={"1rem"} mt={"2rem"}>
        {messages.sort((a: any, b: any): number => {
          return new Date(b.date).getTime() - new Date(a.date).getTime(); 
        }).map((message: any, index: number) => {
          if(message.role === 'system') return null;
          return (
            <AIDialog key={index} item={{text: message.content as string, from: message.from, date: message.date}} />
          )
        })}
      </Flex>
      <SuggestedQuestions question={lastQuestion} sendMessage={handleButton}/>
    </Flex>
  )
}

export default AskAI