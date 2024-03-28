import { Fragment, useEffect, useState } from 'react'
import { AdminTaskItem, NewTaskModal } from '../../Components'
import { PlatformAdminPageLayout } from '../../Layouts'
import { Button, Flex, useBoolean } from '@chakra-ui/react'
import { ITask } from '../../Interface'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../firebaseClient'

const AdminTaskPage = () => {
  
  const [tasks, setTasks] = useState<ITask[]>([])
  const [isNewTaskModalOpen, {toggle: toggleNewTaskModal}] = useBoolean(false)
  
  const getTasks = async () => {
    const tasksDoc = await getDocs(collection(firestore, `tasks`))
    const tasks = tasksDoc.docs.map(doc => doc.data())
    return tasks as ITask[]
  }

  useEffect(() => {
    getTasks()
      .then(result => setTasks(result))
  }, [])
  
  return (
    <>
      <PlatformAdminPageLayout title='Task Tracker'>
        <Flex>
          <Button onClick={toggleNewTaskModal}>
            New Task
          </Button>
        </Flex>
        <Flex direction='column' gap="0.5rem">
          {tasks.map(item => (
            <Fragment key={item.id}>
              <AdminTaskItem item={item}/>
            </Fragment>
          ))}
        </Flex>
      </PlatformAdminPageLayout>
      <NewTaskModal isOpen={isNewTaskModalOpen} onClose={toggleNewTaskModal}/>
    </>
  )
}

export default AdminTaskPage
