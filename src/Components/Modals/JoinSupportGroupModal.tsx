import React, { FC } from 'react'
import { ModalLayout } from '../../Layouts'
import { ModalBody, ModalCloseButton, ModalHeader } from '@chakra-ui/react';
import { JoinSupportGroupForm } from '../SupportGroups';

const JoinSupportGroupModal: FC<{ data: any; }> = ({ data }) => {
  return (
      <ModalLayout>
          <ModalHeader display="flex" flexDirection="column" alignItems="center">
              Join Support Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              pb={6}
          >
            <JoinSupportGroupForm />
          </ModalBody>
      </ModalLayout>
  )
}

export default JoinSupportGroupModal