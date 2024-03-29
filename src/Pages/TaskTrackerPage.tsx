import { Text, Flex } from '@chakra-ui/react'
import { PageLayout } from '../Layouts'
import { Fragment, useEffect, useState } from 'react';
import { ITask } from '../Interface';
import { useTask } from '../Hooks';
import { Meta, TaskItem } from '../Components';

const TaskTrackerPage = () => {
    const { getTasks } = useTask()
    const [tasks, setTasks] = useState<ITask[]>([])

    useEffect(() => {
        getTasks()
            .then(items => setTasks(items))
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <PageLayout leftWidth='100%'>
            <Flex bg="white" p="1rem" gap="1rem" direction="column" align="flex-start">
                <Meta title='Saphron Health | Task Tracking' description='Saphron Health | Task Tracking' />
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
