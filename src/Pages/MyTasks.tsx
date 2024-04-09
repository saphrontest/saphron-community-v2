import { Fragment, useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Text } from '@chakra-ui/react'
import { useTask } from '../Hooks'
import { IUser, IUserTask } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { MyTaskItem } from '../Components'

const MyTasks = () => {

  const { getTasksByUserId } = useTask()
  
  const [myTasks, setMyTasks] = useState<IUserTask[]>([])

  const user: IUser = useSelector((state: RootState) => state.user)
  
  useEffect(() => {
    getTasksByUserId(user.id)
      .then(result => setMyTasks(result))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageLayout showSidebar={false} leftWidth="100%">
        <Flex w="100%" bg="white" p="1rem" direction="column">
            <Text fontWeight="700" fontSize="24px" align="left" mb="1rem">
              My Tasks
            </Text>
            <Flex direction='column' gap="1rem">
              {
                myTasks.map((task: IUserTask, idx: number) => (
                  <Fragment key={task.id}>
                    <MyTaskItem task={task} idx={idx}/>
                  </Fragment>
                ))
              }
            </Flex>
          </Flex>
        <></>
    </PageLayout>
  )
}

export default MyTasks
