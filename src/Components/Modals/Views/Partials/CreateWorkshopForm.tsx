import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Flex, Spinner, Text, Textarea, useToast } from '@chakra-ui/react'
import { InputItem } from '../../../../Layouts'
import TextEditor from '../../../TextEditor'
import { SCIcon } from '../../../SCElements'
import { Link } from 'react-router-dom'
import { doc, runTransaction, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { firestore, storage } from '../../../../firebaseClient'
import md5 from 'md5'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import { IUser, Workshop} from '../../../../Interface'
import { setModal } from '../../../../redux/slices/modalSlice'
import moment from 'moment'
import { PlatformFormItem } from '../../../Platform'

interface IForm {
    workshop_manager_name: string;
    workshop_name: string;
    short_description: string;
    detailed_description: string;
    createdAt: string
}

const CreateWorkshopForm: FC<{ isEdit?: boolean; workshopData?: Workshop; toggleModal?: () => void; }> = ({
    isEdit, workshopData, toggleModal
}) => {
    const dispatch = useDispatch()
    const toast = useToast()
    const user: IUser = useSelector((state: RootState) => state.user)
    const workshopPicRef = useRef<HTMLInputElement | null>(null)
    const [termsCheckbox, setTermsCheckbox] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [coverImg, setCoverImg] = useState<string>('')
    const [form, setForm] = useState<IForm>({
        workshop_manager_name: "",
        workshop_name: "",
        short_description: "",
        detailed_description: "",
        createdAt: ""
    })
    const [formErrors, setFormErrors] = useState({
        workshop_name: {success: true, message: ""},
        short_description: {success: true, message: ""},
        detailed_description: {success: true, message: ""},
        createdAt: {success: true, message: ""},
        coverImg: {success: true, message: ""},
        checkbox: {success: true, message: ""},
    })

    useEffect(() => {
        if(isEdit && workshopData) {
            setForm({
                workshop_name: workshopData.workshop_name,
                workshop_manager_name: workshopData.workshop_manager_name,
                short_description: workshopData.short_description,
                detailed_description: workshopData.detailed_description,
                createdAt: workshopData.createdAt
            })
            setCoverImg(workshopData.cover_img)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit])

    const onChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onImgChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    const updateImage = async (img: string, workshopId: string) => {
        try {
            const imageRef = ref(storage, `workshops/${workshopId}`);
            await uploadString(imageRef, img, "data_url");
            const photoURL = await getDownloadURL(imageRef);
            return photoURL
        } catch (error: any) {
            console.log("updateImage error", error.message);
        }
    };

    const validate = () => {
        setFormErrors({
            workshop_name: {success: !!form.workshop_name, message: "Please, enter workshop name!"},
            createdAt: {success: !!form.createdAt, message: "Please, enter date!"},
            detailed_description: {success: !!form.detailed_description, message: "Please, enter detailed description!"},
            short_description: {success: !!form.short_description, message: "Please, enter short description!"},
            coverImg: {success: !!coverImg.length, message: "Please, enter cover image!"},
            checkbox: {success: termsCheckbox, message: "Please, accept Terms and Conditions!"}
        })
        if(!!form.workshop_name && !!form.createdAt && !!form.detailed_description && !!form.short_description && !!coverImg && termsCheckbox) {
            return true
        }
        return false
    }

    const handleButton = {
        create: async () => {
            setLoading(true)
            try {
                const newWorkshopId = md5(`${form.workshop_name}.${new Date().getTime().toString()}`)
                const newWorkshopDocRef = doc(firestore, "workshops", newWorkshopId);
                await runTransaction(firestore, async (transaction) => {
                    const photoURL = await updateImage(coverImg, newWorkshopId)
                    transaction.set(newWorkshopDocRef, {
                        ...form,
                        createdAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
                        updatedAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
                        workshop_manager_name: form.workshop_manager_name || user.displayName,
                        cover_img: photoURL,
                        workshop_manager_id: user?.id,
                        workshop_manager_avatar: user.profilePhotoURL,
                        workshop_manager_email: user.email,
                        category: "workshop",
                        status: "waiting",
                        requstCount: 0
                    });
                    transaction.set(
                        doc(firestore, `users/${user?.id}/workshops`, newWorkshopId), {
                            workshopId: newWorkshopId,
                            isModerator: true
                        }
                    );
                });
            } catch (error) { } finally {
                setLoading(false)
                toast({
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                    title: "Workshop request submitted. Currently under review. You will be notified of the outcome shortly."
                })
                dispatch(setModal({isOpen: false, view: 'createWorkshop'}))
            }
        },
        edit: async () => {
            setLoading(true)
            try {
                const workshopDocRef = doc(firestore, `workshops/${workshopData?.id}`)
                const photoURL = workshopData?.cover_img !== coverImg && workshopData?.id ? await updateImage(coverImg, workshopData?.id) : workshopData?.cover_img
                await updateDoc(workshopDocRef, { ...form, cover_img: photoURL, })
            } catch (error) {
                
            } finally {
                setLoading(false)
                toast({
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                    title: "Workshop request submitted. Currently under review. You will be notified of the outcome shortly."
                })
                toggleModal && toggleModal()
            }
        }
    }

    const handleSubmit = async () => {
        if(!validate()) {
            return;
        }
        const {edit, create} = handleButton
        if(isEdit) {
            edit()
        }else{
            create()
        }
    }

    return (
        <Flex align="flex-start" w="100%" mt={!isEdit ? "2rem" : ""} direction="column" gap="1rem">
            <PlatformFormItem
            label='Your Name'
            isOptional={true}
            description='Giving your name provides a more trustworthy environment for participants, otherwise your username will be used.'
            >
                <InputItem type='text' name='workshop_manager_name' onChange={onChange} placeholder={workshopData?.workshop_manager_name}/>
            </PlatformFormItem>
            <PlatformFormItem error={!formErrors.workshop_name.success} errorMessage={formErrors.workshop_name.message}  label='Workshop Name' description='Choosing an interesting workshop name will help you attract more participants.'>
                <InputItem type='text' name='workshop_name' onChange={onChange} placeholder={workshopData?.workshop_name}/>
            </PlatformFormItem>
            <PlatformFormItem error={!formErrors.short_description.success} errorMessage={formErrors.short_description.message} label='Short Description' description='The short description is where users first interact with you.'>
                <Textarea
                    width="100%"
                    name='short_description'
                    placeholder={workshopData?.short_description}
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
                    onChange={(ev) => onChange({ target: { name: ev.target.name, value: ev.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
            </PlatformFormItem>
            <PlatformFormItem error={!formErrors.detailed_description.success} errorMessage={formErrors.detailed_description.message} label='Detailed Description' description='A detailed description can be really helpful in directing the right users to attend the workshop, while also preventing irrelevant people from attending. This can make the workshop more productive and efficient.' isFormElement={false}>
                <TextEditor onChange={(_, data) => onChange({ target: { name: 'detailed_description', value: data } } as React.ChangeEvent<HTMLInputElement>)} value={form.detailed_description} />
            </PlatformFormItem>
            <PlatformFormItem  error={!formErrors.createdAt.success} errorMessage={formErrors.createdAt.message} label='Date and Time' description='Workshops prepared on weekends and outside working hours reach more users'>
                <InputItem type='datetime-local' name='createdAt' onChange={onChange} placeholder={workshopData?.createdAt}/>
            </PlatformFormItem>
            <PlatformFormItem error={!formErrors.coverImg.success} errorMessage={formErrors.coverImg.message} label='Cover Photo' isFormElement={false}>
                <input type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" ref={workshopPicRef} onChange={onImgChange} />
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
                    onClick={() => workshopPicRef.current && workshopPicRef.current.click()}
                >
                    {!!coverImg === false && <SCIcon size={24} name='add' />}
                </Flex>
            </PlatformFormItem>
            <Flex gap="0.4rem" align="center" direction="column">
                {!formErrors.checkbox.success && <Text fontSize="12px" color="red" fontStyle="italic">{formErrors.checkbox.message}</Text>}
                <Checkbox
                    iconColor='blue.500'
                    _checked={{ "& .chakra-checkbox__control": { background: "unset" } }}
                    onChange={ev => setTermsCheckbox(ev.target.checked)}
                >
                    <Text color="gray">Accept <Link to={"/community"} style={{ color: "blue" }}>Terms & Conditions</Link></Text>
                </Checkbox>
            </Flex>
            <Flex w="100%" direction="column" align="center" gap="0.3rem">
            <Button w={"100%"} onClick={handleSubmit}>
                {loading ? <Spinner /> : "Submit"}
            </Button>
            <Text fontSize={12} color="gray">
                After your application is reviewed, you will be notified by e-mail.
            </Text>
            </Flex>
        </Flex>
    )
}

export default CreateWorkshopForm