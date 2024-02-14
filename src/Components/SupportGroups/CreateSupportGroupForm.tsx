import React, { FC, useRef, useState } from 'react'
import { ISupportGroup } from '../../Interface/SupportGroupInterface'
import { useSupportGroup } from '../../Hooks'
import { Button, Checkbox, Flex, Spinner, Text, useBoolean, useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { SCIcon } from '../SCElements'
import { InputItem } from '../../Layouts'
import TextEditor from '../TextEditor'
import { PlatformFormItem } from '../Platform'
import moment from 'moment'
import { UserInterface } from '../../Interface/UserInterface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setModal } from '../../redux/slices/modalSlice'
import { storage } from '../../firebaseClient'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import md5 from 'md5'


const CreateSupportGroupForm: FC<{
  supportGroup?: ISupportGroup;
}> = ({
  supportGroup
}) => {
    const toast = useToast()
    const dispatch = useDispatch()
    const { onCreate } = useSupportGroup()
    const [loading, { toggle: toggleLoading }] = useBoolean(false)
    const supportGroupPicRef = useRef<HTMLInputElement | null>(null)
    const user: UserInterface = useSelector((state: RootState) => state.user)

    const [coverImg, setCoverImg] = useState("")
    const [checkbox, setCheckbox] = useState(false)
    const [formItems, setFormItems] = useState({
      cover_img: '',
      support_group_manager_name: '',
      description: '',
      support_group_name: '',
      status: 'waiting'
    })
    const [formErrors, setFormErrors] = useState({
      support_group_name: { success: true, message: "" },
      cover_img: { success: true, message: "" },
      description: { success: true, message: "" },
      checkbox: { success: true, message: "" },
    })

    const validate = () => {
      setFormErrors({
          support_group_name: { success: !!formItems.support_group_name, message: "Please, enter name!" },
          cover_img: { success: !!coverImg, message: "Please, enter cover image!" },
          description: { success: !!formItems.description, message: "Please, enter description!" },
          checkbox: { success: !!checkbox, message: "Please, accept the terms and conditions!" },
      })

      if (
      !!formItems.support_group_name &&
      !!formItems.description &&
      !!coverImg &&
      !!checkbox
      ) {
        return true
      }
      return false
    }

    const updateImage = async (img: string, supportGroupId: string) => {
      try {
          const imageRef = ref(storage, `supportGroups/${supportGroupId}`);
          await uploadString(imageRef, img, "data_url");
          const photoURL = await getDownloadURL(imageRef);
          return photoURL
      } catch (error: any) {
          console.log("updateImage error", error.message);
      }
    };

    const handleCreate = async () => {
      toggleLoading()
      const newSupportGroupId = md5(`${formItems.support_group_name}.${new Date().getTime().toString()}`)
      const img = await updateImage(coverImg, newSupportGroupId)
      if (!validate()) {
        console.log('object')
        return;
      }
      onCreate({
        ...formItems,
        id: newSupportGroupId,
        category: "",
        cover_img: img ?? "",
        createdAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
        updatedAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
        support_group_manager_avatar: user.profilePhotoURL,
        support_group_manager_id: user.id,
        support_group_manager_mail: user.email,
        support_group_manager_name: formItems.support_group_manager_name !== '' ? formItems.support_group_manager_name : user.username,
        status: "waiting"
      })
      .then(() => {
            toast({
                status: "success",
                isClosable: true,
                position: "top-right",
                title: "Create Support Group request submitted. Currently under review. You will be notified of the outcome shortly."
            })
            dispatch(setModal({isOpen: false, view: "createSupportGroup", data: null}))
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoading())
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
      <Flex align="flex-start" w="100%" direction="column" gap="1rem">
        <PlatformFormItem
          label='Your Name'
          isOptional={true}
          description='Giving your name provides a more trustworthy environment for participants, otherwise your username will be used.'
        >
          <InputItem type='text' name='support_group_manager_name' onChange={onChange} placeholder={supportGroup?.support_group_manager_name} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.support_group_name.success} errorMessage={formErrors.support_group_name.message} label='Support Group Name' description='Choosing an interesting group name will help you attract more participants.'>
          <InputItem type='text' name='support_group_name' onChange={onChange} placeholder={supportGroup?.support_group_name} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.description.success} errorMessage={formErrors.description.message} label='Description' description='A detailed description can be really helpful in directing the right users to attend the workshop, while also preventing irrelevant people from attending. This can make the workshop more productive and efficient.' isFormElement={false}>
          <TextEditor onChange={(_, data) => onChange({ target: { name: 'description', value: data } } as React.ChangeEvent<HTMLInputElement>)} value={formItems.description} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.cover_img.success} errorMessage={formErrors.cover_img.message} label='Cover Photo' isFormElement={false}>
          <input type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" ref={supportGroupPicRef} onChange={onImgChange} />
          <Flex
            w="100%"
            h="70px"
            bg="gray.50"
            bgImg={coverImg}
            bgPos={"center center"}
            backgroundSize="cover"
            borderRadius={4}
            align="center"
            justify="center"
            cursor="pointer"
          onClick={() => supportGroupPicRef.current && supportGroupPicRef.current.click()}
          >
            {!!coverImg === false && <SCIcon size={24} name='add' />}
          </Flex>
        </PlatformFormItem>
        <Flex gap="0.4rem" align="center" direction="column">
          {!formErrors.checkbox.success && <Text fontSize="12px" color="red" fontStyle="italic">{formErrors.checkbox.message}</Text>}
          <Checkbox
            iconColor='blue.500'
            _checked={{ "& .chakra-checkbox__control": { background: "unset" } }}
            onChange={ev => setCheckbox(ev.target.checked)}
          >
            <Text color="gray">Accept <Link to={""} style={{ color: "blue" }}>Terms & Conditions</Link></Text>
          </Checkbox>
        </Flex>
        <Button w={"100%"} onClick={handleCreate}>
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </Flex>
    )
  }

export default CreateSupportGroupForm