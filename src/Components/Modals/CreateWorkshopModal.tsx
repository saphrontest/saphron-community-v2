import { Flex, ModalBody, ModalCloseButton, ModalHeader, Text } from '@chakra-ui/react'
import React from 'react'
import { ModalLayout } from '../../Layouts'
import { CreateWorkshopForm } from './Views'

const CreateWorkshopModal = () => {
    return (
        <ModalLayout>
            <ModalHeader display="flex" flexDirection="column" alignItems="flex-start">
                <Text align="left">
                    I wan’t to be a workshop manager!
                </Text>
            </ModalHeader>
            <ModalCloseButton />
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
                >
                    <Text fontStyle="italic">
                        Join us as Workshop Manager! Take charge of creating impactful events, coordinating logistics, and fostering a seamless experience for all. If you're organized, passionate, and love facilitating positive change, come lead our workshops to new heights.
                    </Text>
                    <CreateWorkshopForm />
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default CreateWorkshopModal