import { FC, ReactNode, useState } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { ModalBody, Flex, Text, Box, ModalCloseButton, Textarea, Button } from '@chakra-ui/react'
import { WorkshopCard } from '../Workshops'
import { Workshop } from '../../Interface/WorkshopInterface'

const FormItem: FC<{
    children: ReactNode;
    label: string;
    isOptional?: boolean;
    description?: string;
}> = ({ children, label, isOptional = false, description }) => {
    return (
        <Flex gap="0.3rem" direction="column" w="100%">
            <Flex gap="0.4rem" align="center">
                <Text fontWeight="600">{label}</Text>
                {isOptional && <Text fontSize="12px" color="gray" fontStyle="italic">Optional</Text>}
            </Flex>
            <Text fontSize="14px" color="gray">
                {description}

            </Text>
            {children}
        </Flex>
    )
}

const JoinWorkshopModal: FC<{ data: any }> = ({ data: workshop }) => {

    const [formItems, setFormItems]= useState<{ name: string; motivation: string; }>({
        name: "", motivation: ""
    })

    const handleSubmit = () => {
        console.log(formItems)
    }

    return (
        <ModalLayout size='xl' isCentered={false}>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                pb={6}
            >
                <Flex
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="center"
                    gap="1rem"
                    h="100%"
                >
                    <Flex minW="40%" h="100%" align="center" justify="center" pt="1rem">
                        <WorkshopCard workshop={workshop as Workshop} />
                    </Flex>
                    <Flex direction="column" >
                        <Box marginBottom="3rem">
                            <Text align="left" fontSize={22} fontWeight={400} pb="0.4rem">
                                Join <strong>{workshop.manager.split(" ")[0]}</strong>'s Workshop
                            </Text>
                            <Text fontStyle="italic">
                                Let's help him run a more efficient session by filling in the form below.
                            </Text>
                        </Box>
                        <Flex gap="1rem" direction="column">
                            <FormItem label='Name' isOptional={true}>
                                <InputItem type='text' name='name' onChange={ev => setFormItems((prev) => ({ ...prev, "name": ev.target.value }))}/>
                            </FormItem>
                            <FormItem label='Could you please tell us your motivation for attending this workshop?'>
                                <Textarea
                                    width="100%"
                                    name='short_description'
                                    _placeholder={{ color: "gray.500" }}
                                    _hover={{
                                        bg: "white",
                                        border: "1px solid",
                                        borderColor: "blue.500",
                                    }}
                                    _focus={{
                                        outline: "none",
                                        bg: "white",
                                        border: "1px solid",
                                        borderColor: "blue.500",
                                    }}
                                    bg={"gray.50"}
                                    borderRadius={4}
                                    fontSize="10pt"
                                    onChange={ev => setFormItems((prev) => ({ ...prev, "motivation": ev.target.value }))}
                                />
                            </FormItem>
                            <Button onClick={handleSubmit}>
                                Send
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default JoinWorkshopModal