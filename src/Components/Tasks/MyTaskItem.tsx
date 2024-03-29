import { Box, Flex, Text } from '@chakra-ui/react'
import moment from 'moment'
import React, { FC } from 'react'
import { IUserTask } from '../../Interface'

const MyTaskItem: FC<{ idx: number; task: IUserTask; }> = ({
    idx, task
}) => {
    return (
        <Flex
            p="1rem"
            w="100%"
            bg="gray.100"
            align={["flex-start", "center"]}
            borderRadius="1rem"
            justify="space-between"
            direction={["column", "row"]}
        >
            <Flex direction="row" align="center" gap="1rem">
                <Text color="gray" fontWeight="700">
                    #{idx + 1}
                </Text>
                <Flex direction="column" align="flex-start">
                    <Text fontWeight="600">
                        {task.name}
                    </Text>
                    <Text>
                        joined {moment(new Date(task.joinedAt)).fromNow()}
                    </Text>
                </Flex>
            </Flex>
            <Box
                bg="white"
                p="0.4rem 0.8rem"
                borderRadius="1rem"
                mt={["1rem", "0"]}
            >
                <Text>
                    Progress: <strong>{task.progress}%</strong>
                </Text>
            </Box>
        </Flex>
    )
}

export default MyTaskItem
