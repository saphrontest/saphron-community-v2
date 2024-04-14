import { useEffect, useState } from 'react'
import SuggestedQuestions from './SuggestedQuestions'
import { openai } from '../../openAIClient'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources'
import { AIMessages, AskAIForm, SearchHeader } from './Partials'
import { Flex, useToast } from '@chakra-ui/react'
import { AIMessageInterface } from '../../Interface'

const AskAI = () => {
  const toast = useToast()
  const [text, setText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [params, setParams] = useState<ChatCompletionCreateParamsNonStreaming>({
    messages: [{ role: "system", content: "You are a helpful assistant."}],
    model: "gpt-3.5-turbo",
  })
  const [sendMessage, setSendMessage] = useState<boolean>(false)
  const [messages, setMessages] = useState<AIMessageInterface[]>([])
  const [lastQuestion, setLastQuestion] = useState<string>("")

  const send = async () => {
    try {
      const response = await openai.chat.completions.create(params);
      setMessages((prev: any) => ([
        ...prev,
        {
          date: new Date().toString(),
          from: response.choices[0].message.role,
          content: response.choices[0].message.content
        }
      ]))
      setParams(prev => ({
        messages: [...prev.messages, response.choices[0].message],
        model: "gpt-3.5-turbo"
      }))
    } catch (err) {
      toast({
        title: "Try Again later..",
        status: "error",
        isClosable: true
      })
    } finally {
      setSendMessage(false)
      setLoading(false)
    }
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
        date: new Date().toString(),
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
      <SearchHeader title='Ask to Saphron AI' description='You can ask the Saphron AI, which is developed using ChatGPT for our community members.'/>
      {messages.length ? <AIMessages messages={messages}/> : null}
      <AskAIForm 
      handleButton={handleButton}
      loading={loading}
      setText={setText}
      />
      <SuggestedQuestions question={lastQuestion} sendMessage={handleButton}/>
    </Flex>
  )
}

export default AskAI