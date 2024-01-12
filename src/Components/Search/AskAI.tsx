import { Box, Button, Flex, Heading, Stack, Text, Textarea } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import AIDialog from './AIDialog'
import SuggestedQuestions from './SuggestedQuestions'
import { openai } from '../../openAIClient'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources'

const AskAI = () => {
  const [text, setText] = useState<string>("")
  const [params, setParams] = useState<ChatCompletionCreateParamsNonStreaming>({
    messages: [{ role: "system", content: "You are a helpful assistant."}],
    model: "gpt-3.5-turbo",
  })
  const [sendMessage, setSendMessage] = useState<boolean>(false)
  

  const send = async () => {
    console.log(params)
    const response = await openai.chat.completions.create(params);
    console.log(response)
  }

  useEffect(() => {
    if(sendMessage) {
      send()
      return () => setSendMessage(false)
    }
  }, [sendMessage])

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
            onClick={() => {
              setParams(prev => ({
                messages: [...prev.messages, {role: 'user', content: text}],
                model: "gpt-3.5-turbo"
              }))
              setSendMessage(true)
            }}
          >
            Ask to Saphron AI
          </Button>
        </Stack>
      </Flex>
      <Flex direction="column" width="100%" gap={"1rem"} mt={"2rem"}>
        <AIDialog item={{
          text: "What are some common symptoms of OCPD?",
          from: "user",
          date: "12.03.1233 12:07"
        }}/>
        <AIDialog item={{
          text: "Minim est fugiat aliquip ipsum sint nisi ullamco. Adipisicing irure mollit enim nisi exercitation tempor in cillum id. Amet aute amet in officia anim. Amet nostrud aute consectetur velit culpa consectetur Lorem consectetur exercitation et exercitation ullamco velit est.",
          from: "saphron_ai",
          date: "12.03.1233 12:08"
        }}/>
        <AIDialog item={{
          text: "thank you",
          from: "user",
          date: "12.03.1233 12:09"
        }}/>
      </Flex>
      <SuggestedQuestions />
    </Flex>
  )
}

export default AskAI