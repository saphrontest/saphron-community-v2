import { useEffect, useState } from 'react'
import SuggestedQuestions from './SuggestedQuestions'
import { openai } from '../../openAIClient'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources'
import moment from 'moment'
import { AIMessages, AskAIForm, SearchHeader } from './Partials'
import { Flex } from '@chakra-ui/react'

interface AIMessage {
  date: string,
  from: string,
  content: string
}

const AskAI = () => {
  const [text, setText] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<ChatCompletionCreateParamsNonStreaming>({
    messages: [{ role: "system", content: "You are a helpful assistant."}],
    model: "gpt-3.5-turbo",
  })
  const [sendMessage, setSendMessage] = useState<boolean>(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
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
      <SearchHeader title='Ask to Saphron AI' description='You can ask the Saphron AI, which is developed using ChatGPT for our community members.'/>
      <AskAIForm 
      handleButton={handleButton}
      loading={loading}
      setText={setText}
      />
      <AIMessages messages={messages}/>
      <SuggestedQuestions question={lastQuestion} sendMessage={handleButton}/>
    </Flex>
  )
}

export default AskAI