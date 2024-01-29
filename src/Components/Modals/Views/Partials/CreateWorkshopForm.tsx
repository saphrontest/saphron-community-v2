import { Button, Flex, Text, Textarea } from '@chakra-ui/react'
import { ChangeEvent, FC, ReactNode, useRef } from 'react'
import { InputItem } from '../../../../Layouts'
import TextEditor from '../../../TextEditor'
import { SCIcon } from '../../../SCElements'

const CreateWorkshopForm = () => {

    const workshopPicRef = useRef<HTMLInputElement | null>(null)

    const FormItem: FC<{
        children: ReactNode;
        label: string;
        isOptional?: boolean;
        description?: string;
    }> = ({children, label, isOptional=false, description}) => {
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

    const onFileChange = (event: ChangeEvent<HTMLInputElement>,) => {}

    return (
        <Flex align="flex-start" w="100%" mt="2rem" direction="column" gap="1rem">
            <FormItem label='Your Name' description='Giving your name provides a more trustworthy environment for participants, otherwise your username will be used.' isOptional={true}>
                <InputItem type='text' name='your_name'/>
            </FormItem>
            <FormItem label='Workshop Name' description='Choosing an interesting workshop name will help you attract more participants.'>
                <InputItem type='text' name='workshop_name'/>
            </FormItem>
            <FormItem label='Short Description' description='The short description is where users first interact with you.'>
                <Textarea
                width="100%"
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
                />
            </FormItem>
            <FormItem label='Detailed Description' description='A detailed description can be really helpful in directing the right users to attend the workshop, while also preventing irrelevant people from attending. This can make the workshop more productive and efficient.'>
                <TextEditor onChange={(_, text) => console.log(text)} value='text'/>
            </FormItem>
            <FormItem label='Date and Time' description='Workshops prepared on weekends and outside working hours reach more users'>
                <InputItem type='datetime-local' name='workshop_name' onChange={(ev) => console.log(ev.target.value)}/>
            </FormItem>
            <FormItem label='Cover Photo'>
                <input type="file" style={{display: "none"}} accept="image/x-png,image/gif,image/jpeg" ref={workshopPicRef} onChange={onFileChange}/>
                <Flex w="100%" h="70px" bg="gray.50" borderRadius={4} align="center" justify="center" cursor="pointer" onClick={() => workshopPicRef.current && workshopPicRef.current.click()}>
                    <SCIcon size={24} name='add' />
                </Flex>
            </FormItem>
            <Button w={"100%"}>
                Submit
            </Button>
        </Flex>
    )
}

export default CreateWorkshopForm