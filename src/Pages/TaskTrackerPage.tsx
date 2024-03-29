import { Text, Flex } from '@chakra-ui/react'
import { PageLayout } from '../Layouts'
import { Fragment, useEffect, useState } from 'react';
import { ITask, IUser, IUserTask } from '../Interface';
import { useTask } from '../Hooks';
import { Meta, TaskItem } from '../Components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const TaskTrackerPage = () => {

    const { getTasks, getTasksByUserId } = useTask()

    const [tasks, setTasks] = useState<ITask[]>([])
    const [myTasks, setMyTasks] = useState<IUserTask[]>([])

    const user: IUser = useSelector((state: RootState) => state.user)

    useEffect(() => {

        getTasks()
            .then(items => setTasks(items))

        getTasksByUserId(user.id)
            .then(items => setMyTasks(items))

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
                            <TaskItem
                            item={taskItem}
                            isJoined={myTasks.some(item => item.id === taskItem.id)}
                            reloadMyTasks={() => {
                                getTasksByUserId(user.id)
                                .then(items => setMyTasks(items))
                            }}
                            />
                        </Fragment>
                    ))}
                </Flex>
            </Flex>
            <></>
        </PageLayout>
    )
}

export default TaskTrackerPage
