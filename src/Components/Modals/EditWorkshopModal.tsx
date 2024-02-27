import { Flex, ModalBody, ModalCloseButton, ModalHeader, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { ModalLayout } from '../../Layouts'
import { CreateWorkshopForm } from './Views'
import { Workshop } from '../../Interface'

const EditWorkshopModal: FC<{ isOpen: boolean; toggleModal: () => void; workshop: Workshop }> = ({isOpen, toggleModal, workshop}) => {

    return (
        <ModalLayout isOpen={isOpen}>
            <ModalHeader display="flex" flexDirection="column" alignItems="flex-start">
                <Text align="left" fontWeight={400}>
                    Edit <strong>{workshop.workshop_name}</strong> Workshop
                </Text>
                <ModalCloseButton onClick={() => toggleModal()}/>
            </ModalHeader>
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                pb={6}
            >
                <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                >
                    <CreateWorkshopForm isEdit={true} workshopData={workshop}/>
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default EditWorkshopModal