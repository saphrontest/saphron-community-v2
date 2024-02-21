import { ModalHeader, ModalCloseButton, ModalBody, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ModalLayout } from "../../../Layouts";

const DescriptionModal: FC<{ isOpen: boolean; onClose: () => void, description: string; name: string }> = ({ isOpen, onClose, description, name }) => {
    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <ModalHeader display="flex" flexDirection="column" alignItems="center">
                <Text textTransform="capitalize">{name}</Text>
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
                    <Text dangerouslySetInnerHTML={{ __html: description }} />
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default DescriptionModal