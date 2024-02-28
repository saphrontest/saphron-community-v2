import { ModalBody, ModalCloseButton, ModalHeader, Text } from '@chakra-ui/react'
import React from 'react'
import { ModalLayout } from '../../Layouts'
import { CreateWorkshopForm } from './Views'

const CreateWorkshopModal = () => {

    return (
        <ModalLayout>
            <ModalHeader textAlign="left" fontSize="16px">
                    I wan’t to be a workshop manager!
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontStyle="italic">
                    Join us as Workshop Manager! Take charge of creating impactful events, coordinating logistics, and fostering a seamless experience for all. If you're organized, passionate, and love facilitating positive change, come lead our workshops to new heights.
                </Text>
                <CreateWorkshopForm />
            </ModalBody>
        </ModalLayout>
    )
}

export default CreateWorkshopModal