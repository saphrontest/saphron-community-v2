import React, { FC, useRef, useState } from 'react'
import { ISupportGroup } from '../../Interface/SupportGroupInterface'
import { useSupportGroup } from '../../Hooks'
import { Button, Checkbox, Flex, Spinner, Text, Textarea, useBoolean, useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { SCIcon } from '../SCElements'
import { InputItem } from '../../Layouts'
import TextEditor from '../TextEditor'
import { PlatformFormItem } from '../Platform'


const CreateSupportGroupForm: FC<{
  supportGroup?: ISupportGroup;
}> = ({
  supportGroup
}) => {
    const toast = useToast()
    const supportGroupPicRef = useRef<HTMLInputElement | null>(null)
    const { onCreate } = useSupportGroup()
    const [loading, { toggle: toggleLoading }] = useBoolean(false)
    const [coverImg, setCoverImg] = useState("")
    const [formItems, setFormItems] = useState<ISupportGroup>({
      cover_img: '',
      category: '',
      createdAt: '',
      updatedAt: '',
      description: '',
      support_group_name: '',
      support_group_manager_id: '',
      support_group_manager_name: '',
      support_group_manager_avatar: '',
      support_group_manager_mail: '',
      status: 'waiting'
    })
    const [formErrors, setFormErrors] = useState({
      support_group_name: { success: true, message: "" },
      cover_img: { success: true, message: "" },
      description: { success: true, message: "" },
      support_group_manager_mail: { success: true, message: "" },
      checkbox: { success: true, message: "" },
    })

    const validate = () => {
      return true
    }

    const handleCreate = () => {

      if (!validate()) {
        return;
      }

      toggleLoading()
      try {
        onCreate(formItems)
      } catch (error) {

      } finally {
        toggleLoading()
      }

    }

    const onChange = ({
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setFormItems((prev) => ({ ...prev, [name]: value }));
    };

    const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const reader = new FileReader();
      if (event.target.files?.[0]) {
          reader.readAsDataURL(event.target.files[0]);
      }
      reader.onload = (readerEvent) => {
          if (readerEvent.target?.result) {
              setCoverImg(readerEvent.target?.result as string)
          }
      };
  }

    return (
      <Flex align="flex-start" w="100%" mt={!!supportGroup === false ? "2rem" : ""} direction="column" gap="1rem">
        <PlatformFormItem
          label='Your Name'
          isOptional={true}
          description='Giving your name provides a more trustworthy environment for participants, otherwise your username will be used.'
        >
          <InputItem type='text' name='workshop_manager_name' onChange={onChange} placeholder={supportGroup?.support_group_manager_name} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.support_group_name.success} errorMessage={formErrors.support_group_name.message} label='Workshop Name' description='Choosing an interesting workshop name will help you attract more participants.'>
          <InputItem type='text' name='workshop_name' onChange={onChange} placeholder={supportGroup?.support_group_name} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.description.success} errorMessage={formErrors.description.message} label='Description' description='The short description is where users first interact with you.'>
          <Textarea
            width="100%"
            name='short_description'
            placeholder={supportGroup?.description}
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
          // onChange={(ev) => onChange({ target: { name: ev.target.name, value: ev.target.value } } as React.ChangeEvent<HTMLInputElement>)}
          />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.description.success} errorMessage={formErrors.description.message} label='Detailed Description' description='A detailed description can be really helpful in directing the right users to attend the workshop, while also preventing irrelevant people from attending. This can make the workshop more productive and efficient.' isFormElement={false}>
          <TextEditor onChange={(_, data) => onChange({ target: { name: 'detailed_description', value: data } } as React.ChangeEvent<HTMLInputElement>)} value={formItems.description} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.cover_img.success} errorMessage={formErrors.cover_img.message} label='Cover Photo' isFormElement={false}>
          <input type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" ref={supportGroupPicRef} onChange={onImgChange} />
          <Flex
            w="100%"
            h="70px"
            bg="gray.50"
            // bgImg={coverImg}
            bgPos={"center center"}
            backgroundSize="cover"
            borderRadius={4}
            align="center"
            justify="center"
            cursor="pointer"
          // onClick={() => workshopPicRef.current && workshopPicRef.current.click()}
          >
            {!!coverImg === false && <SCIcon size={24} name='add' />}
          </Flex>
        </PlatformFormItem>
        <Flex gap="0.4rem" align="center" direction="column">
          {!formErrors.checkbox.success && <Text fontSize="12px" color="red" fontStyle="italic">{formErrors.checkbox.message}</Text>}
          <Checkbox
            iconColor='blue.500'
            _checked={{ "& .chakra-checkbox__control": { background: "unset" } }}
          >
            <Text color="gray">Accept <Link to={"/community"} style={{ color: "blue" }}>Terms & Conditions</Link></Text>
          </Checkbox>
        </Flex>
        <Button w={"100%"} onClick={handleCreate}>
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </Flex>
    )
  }

export default CreateSupportGroupForm