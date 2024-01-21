import { Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react';
import { RiQuestionnaireFill } from "react-icons/ri";
import { openai } from '../../openAIClient';

interface SuggestedQuestionsProps {
  question: string;
  sendMessage: (question: string | null) => void;
}

const SuggestedQuestions: FC<SuggestedQuestionsProps> = ({question, sendMessage}) => {

  const [suggestions, setSuggestions] = useState<string[]>()

  useEffect(() => {
    if(!!question) {
      createSuggestions(question)
    }
  }, [question])

  const createSuggestions = async (question: string) => {
    const respone = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant for creating suggestion questions that are related with giving question. You should create 3 question."},
        { role: "user", content:  question}
      ],
      model: "gpt-3.5-turbo",
    });
    if(respone.choices[0].message.content) {

      const questions = respone.choices[0].message.content.split(/\d+\./).filter(item => item.trim() !== '').map(item => item.trim());
      setSuggestions(questions)
    }
  }

  const Suggestion: FC<{ text: string }> = ({ text }) => {
    return (
      <Flex
        p="0.4rem 0.6rem"
        cursor="pointer"
        border="2px solid"
        borderColor="gray.100"
        borderRadius="0.4rem"
        _hover={{bg: "gray.50"}}
        alignItems="center"
        onClick={() => sendMessage(text)}
        >
          <Text fontWeight={500} fontSize={16} textAlign={"right"} w={"fit-content"}>
            {text}
          </Text>
          <Icon as={RiQuestionnaireFill} ml="0.4rem" fontSize={18}/>
      </Flex>
    )
  }

  return (
    <Flex direction="column" align={"flex-end"}>
        {!!suggestions && (
          <>
            <Heading fontSize={18} textAlign="right" mt={"1.5rem"} mb={"0.4rem"}>
                Suggested Questions
            </Heading>
            <Flex direction="column" align="end" gap={1}>
              {suggestions?.map((item, idx) => <Suggestion key={idx} text={item} />)}
            </Flex>
          </>
        )}
    </Flex>
  )
}

export default SuggestedQuestions