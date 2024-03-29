import { Fragment, useEffect, useState } from 'react'
import { AdminTaskItem, NewTaskModal } from '../../Components'
import { PlatformAdminPageLayout } from '../../Layouts'
import { Button, Flex, useBoolean } from '@chakra-ui/react'
import { ITask } from '../../Interface'
import { useTask } from '../../Hooks'

const AdminTaskPage = () => {
  
  const {getTasks} = useTask()
  const [tasks, setTasks] = useState<ITask[]>([])
  const [isNewTaskModalOpen, {toggle: toggleNewTaskModal}] = useBoolean(false)

  const reloadState = () => {
    getTasks()
      .then(result => setTasks(result))
  }

  useEffect(() => {
    reloadState()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <NewTaskModal
      isOpen={isNewTaskModalOpen}
      onClose={toggleNewTaskModal}
      reloadState={reloadState}
      />
    </>
  )
}

export default AdminTaskPage
