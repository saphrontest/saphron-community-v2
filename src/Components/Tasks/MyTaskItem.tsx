import { Box, Checkbox, Divider, Flex, Text, useBoolean } from '@chakra-ui/react'
import moment from 'moment'
import { FC } from 'react'
import { IUserTask } from '../../Interface'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const Content: FC<{ task: IUserTask }> = ({ task }) => {
    return (
        <Flex direction="column" align="flex-start" w="100%">
            <Divider borderColor="gray" my="1rem" />
            <Text mb="1rem">
                {task.description}
            </Text>
            {task.controlList?.length && (
                <>
                    <Text fontWeight={700} fontSize="20px" mb="0.5rem">
                        Control List
                    </Text>
                    {task.controlList?.map((item, idx) => (
                        <Checkbox
                            key={item.id}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            isChecked={task.progress > (idx + 1) * 100 / (task.controlList?.length || 0)}
                        >
                            <Text textAlign="left" fontWeight={600} fontSize="18px">
                                {item.name}
                            </Text>
                            <Text>
                                {item.description}
                            </Text>
                        </Checkbox>
                    ))}
                </>
            )}
        </Flex>
    )
}

const MyTaskItem: FC<{ idx: number; task: IUserTask; }> = ({
    idx, task
}) => {
    const [clicked, { toggle: toggleClick }] = useBoolean(false)
    return (
        <Flex
            p="1rem"
            w="100%"
            bg="gray.100"
            borderRadius="1rem"
            direction="column"
            gap="1rem"
        >
            <Flex
                w="100%"
                justify="space-between"
                align={["flex-start", "center"]}
                direction={["column", "row"]}
                cursor="pointer"
                onClick={toggleClick}
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
                <Flex>
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
                    {clicked ? <MdKeyboardArrowUp size="32px" /> : <MdKeyboardArrowDown size="32px" />}
                </Flex>
            </Flex>
            {clicked ? <Content task={task} /> : null}
        </Flex>
    )
}

export default MyTaskItem
