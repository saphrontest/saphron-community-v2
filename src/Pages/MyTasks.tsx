import React, { Fragment } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Text } from '@chakra-ui/react'

const MyTasks = () => {
  return (
    <PageLayout showSidebar={false} leftWidth="100%">
        <Flex w="100%" bg="white" p="1rem" direction="column">
            <Text fontWeight="700" fontSize="24px" align="left" mb="1rem">
              My Tasks
            </Text>
            <Flex direction='column' gap="1rem">
              
            </Flex>
          </Flex>
        <></>
    </PageLayout>
  )
}

export default MyTasks
