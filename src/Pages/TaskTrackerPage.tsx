import { 
    Text,
    Flex,
    List,
    Button,
    ListItem,
    useBoolean
} from '@chakra-ui/react'

import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp
} from "react-icons/md";

import { PageLayout } from '../Layouts'
import { CheckIcon } from '@chakra-ui/icons';
import { FC } from 'react';

const TaskItem:FC<{ name: string; }> = ({ name }) => {

    const [clicked, {toggle: toggleClick}] = useBoolean(false)

    const handleClick = () => {
        console.log('object')
    }

    return (
        <Flex bg="gray.100" p="1rem" w="100%" borderRadius="0.5rem" align="flex-start" justify="space-between" direction="column">
            <Flex w="100%" justify="space-between" onClick={toggleClick} cursor="pointer">
                <Text fontWeight={600} fontSize="18px">Task - {name}</Text>
                {clicked ? <MdKeyboardArrowUp size="32px" /> : <MdKeyboardArrowDown size="32px" />}
            </Flex>
            {clicked && (
                <Flex direction="column" gap="1rem">
                    <Text>
                        Description
                    </Text>
                    <List>
                        <ListItem display="flex" gap="0.3rem" alignItems="center">
                            <CheckIcon />
                            Check 1
                        </ListItem>
                        <ListItem display="flex" gap="0.3rem" alignItems="center">
                            <CheckIcon />
                            Check 2
                        </ListItem>
                        <ListItem display="flex" gap="0.3rem" alignItems="center">
                            <CheckIcon />
                            Check 3
                        </ListItem>
                    </List>
                    <Button h="30px" onClick={handleClick}>Start</Button>
                </Flex>
            )}
        </Flex>
    )
}

const TaskTrackerPage = () => {
    return (
        <PageLayout leftWidth='100%'>
            <Flex bg="white" p="1rem" gap="1rem" direction="column" align="flex-start">
                <Text fontWeight="700" fontSize="22px">
                    Task List
                </Text>
                <Flex direction="column" w="100%" gap="1rem">
                    <TaskItem name={"1"}/>
                    <TaskItem name={"2"}/>
                    <TaskItem name={"3"}/>
                    <TaskItem name={"4"}/>
                </Flex>
            </Flex>
            <></>
        </PageLayout>
    )
}

export default TaskTrackerPage
