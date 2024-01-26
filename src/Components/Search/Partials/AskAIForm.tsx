import { Button, Flex, Spinner, Stack, Textarea } from '@chakra-ui/react'
import React, { FC } from 'react'

interface AskAIFormProps {
    setText: (value: string) => void;
    handleButton: (question?: string | null) => void;
    loading: boolean;
}

const AskAIForm: FC<AskAIFormProps> = ({loading, setText, handleButton}) => {
  return (
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
  )
}

export default AskAIForm