import React, { FC } from 'react'
import { ModalLayout } from '../../Layouts'
import { ModalBody, ModalCloseButton, ModalHeader } from '@chakra-ui/react';
import { JoinSupportGroupForm } from '../SupportGroups';
import { ISupportGroup } from '../../Interface/SupportGroupInterface';

const JoinSupportGroupModal: FC<{ data: ISupportGroup; }> = ({ data }) => {
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
            <JoinSupportGroupForm supportGroup={data}/>
          </ModalBody>
      </ModalLayout>
  )
}

export default JoinSupportGroupModal