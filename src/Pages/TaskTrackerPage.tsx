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
import { FC, Fragment, useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebaseClient';
import { ITask, ITaskControlItem } from '../Interface';

const TaskItem: FC<{ item: ITask; }> = ({ item }) => {

    const [clicked, { toggle: toggleClick }] = useBoolean(false)

    const handleClick = () => {
        console.log('object')
    }

    return (
        <Flex bg="gray.100" p="1rem" w="100%" borderRadius="0.5rem" align="flex-start" justify="space-between" direction="column">
            <Flex w="100%" justify="space-between" onClick={toggleClick} cursor="pointer">
                <Text fontWeight={600} fontSize="18px">{item.name}</Text>
                <Flex align="center" gap="1rem">
                    <Button h="30px" onClick={handleClick}>Start</Button>
                    {clicked ? <MdKeyboardArrowUp size="32px" /> : <MdKeyboardArrowDown size="32px" />}
                </Flex>
            </Flex>
            {clicked && (
                <Flex direction="column" gap="1rem" w="100%">
                    <Text textAlign="left">
                        {item.description}
                    </Text>
                    {item.controlList?.length && <List>
                        {item.controlList.map(item => (
                            <ListItem key={item.id} display="flex" gap="0.3rem" alignItems="center">
                                <CheckIcon />
                                {item.name}
                            </ListItem>
                        ))}
                    </List>
                    }
                </Flex>
            )}
        </Flex>
    )
}

const TaskTrackerPage = () => {

    const [tasks, setTasks] = useState<ITask[]>([])

    const getTasks = async () => {
        const tasksDoc = await getDocs(collection(firestore, `tasks`))
        const tasks = tasksDoc.docs.map(doc => doc.data())
        return tasks as ITask[]
    }

    const getControlListByTaskId = async (taskId: string) => {
        const controlListDoc = await getDocs(collection(firestore, `tasks/${taskId}/controlList`))
        const controlList = controlListDoc.docs.map(doc => doc.data())
        return controlList as ITaskControlItem[]
    }

    useEffect(() => {
        getTasks().then(items => {
            items.forEach(taskItem => {
                getControlListByTaskId(taskItem.id).then(result => {

                })
            })
            setTasks(items)

        })
    }, [])

    return (
        <PageLayout leftWidth='100%'>
            <Flex bg="white" p="1rem" gap="1rem" direction="column" align="flex-start">
                <Text fontWeight="700" fontSize="22px">
                    Task List
                </Text>
                <Flex direction="column" w="100%" gap="1rem">
                    {tasks.map(taskItem => (
                        <Fragment key={taskItem.id}>
                            <TaskItem item={taskItem} />
                        </Fragment>
                    ))}
                </Flex>
            </Flex>
            <></>
        </PageLayout>
    )
}

export default TaskTrackerPage
