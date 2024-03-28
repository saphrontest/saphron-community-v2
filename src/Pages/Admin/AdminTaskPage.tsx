import { AdminTaskItem, NewTaskModal } from '../../Components'
import { PlatformAdminPageLayout } from '../../Layouts'
import { Button, Flex, useBoolean } from '@chakra-ui/react'

const AdminTaskPage = () => {
  const [isNewTaskModalOpen, {toggle: toggleNewTaskModal}] = useBoolean(false)
  return (
    <>
      <PlatformAdminPageLayout title='Task Tracker'>
        <Flex>
          <Button onClick={toggleNewTaskModal}>
            New Task
          </Button>
        </Flex>
        <Flex direction='column' gap="0.5rem">
          <AdminTaskItem item={{
            id: 'task-1',
            name: 'Task Tracker item',
            description: 'Task Tracker',
            controlList: [
              {id: 'task-2', name: 'Task Tracker item', description: 'description'}
            ]
          }}/>
          <AdminTaskItem item={{
            id: 'task-2',
            name: 'Task Tracker item 2',
            description: 'Task Tracker item description',
          }}/>
        </Flex>
      </PlatformAdminPageLayout>
      <NewTaskModal isOpen={isNewTaskModalOpen} onClose={toggleNewTaskModal}/>
    </>
  )
}

export default AdminTaskPage
