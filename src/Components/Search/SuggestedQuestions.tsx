import { Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { RiQuestionnaireFill } from "react-icons/ri";

const SuggestedQuestions = () => {
  return (
    <Flex direction="column" align={"flex-end"}>
        <Heading fontSize={18} textAlign="right" mt={"1.5rem"} mb={"0.4rem"}>
            Suggested Questions
        </Heading>
        <Flex>
              <Flex
              p="0.4rem 0.6rem"
              cursor="pointer"
              border="2px solid"
              borderColor="gray.100"
              borderRadius="0.4rem"
              _hover={{bg: "gray.50"}}
              alignItems="center"
              >
                <Text fontWeight={500} fontSize={16} textAlign={"right"} w={"fit-content"}>
                    Ullamco eiusmod nostrud minim culpa consectetur commodo proident quis Lorem consequat?
                </Text>
                <Icon as={RiQuestionnaireFill} ml="0.4rem" fontSize={18}/>
            </Flex>
        </Flex>
    </Flex>
  )
}

export default SuggestedQuestions