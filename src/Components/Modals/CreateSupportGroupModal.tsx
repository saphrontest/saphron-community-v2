import { ModalLayout } from '../../Layouts'
import { ModalBody, ModalCloseButton, ModalHeader } from '@chakra-ui/react'
import { CreateSupportGroupForm } from '../SupportGroups'

const CreateSupportGroupModal = () => {
  return (
    <ModalLayout>
          <ModalHeader display="flex" flexDirection="column" alignItems="center">
              Create Support Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              pb={6}
          >
            <CreateSupportGroupForm />
          </ModalBody>
      </ModalLayout>
  )
}

export default CreateSupportGroupModal