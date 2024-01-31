import { ChangeEvent, FC, ReactNode, useRef, useState } from 'react'
import { Button, Checkbox, Flex, FormControl, Spinner, Text, Textarea, useToast } from '@chakra-ui/react'
import { InputItem } from '../../../../Layouts'
import TextEditor from '../../../TextEditor'
import { SCIcon } from '../../../SCElements'
import { Link } from 'react-router-dom'
import { doc, runTransaction } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { firestore, storage } from '../../../../firebaseClient'
import md5 from 'md5'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import { UserInterface } from '../../../../Interface/UserInterface'
import { setModal } from '../../../../redux/slices/modalSlice'

const FormItem: FC<{
    children: ReactNode;
    label: string;
    isOptional?: boolean;
    description?: string;
    isFormElement?: boolean;
    error?: boolean;
    errorMessage?: string;
}> = ({ children, label, isOptional = false, description, isFormElement = true, error, errorMessage }) => {
    return (
        <Flex gap="0.3rem" direction="column" w="100%" pb={"0.4rem"}>
            <Flex gap="0.4rem" align="center">
                <Text fontWeight="600">{label}</Text>
                {isOptional && <Text fontSize="12px" color="gray" fontStyle="italic">Optional</Text>}
                {error && <Text fontSize="12px" color="red" fontStyle="italic">{errorMessage}</Text>}
            </Flex>
            <Text fontSize="14px" color="gray">
                {description}
            </Text>
            {isFormElement ? (
                <FormControl>
                    {children}
                </FormControl>
            ) : children}
        </Flex>
    )
}

interface FormInterface {
    workshop_manager_name: string;
    workshop_name: string;
    short_description: string;
    detailed_description: string;
    date: string
}

const CreateWorkshopForm = () => {
    const dispatch = useDispatch()
    const toast = useToast()
    const user: UserInterface = useSelector((state: RootState) => state.user)
    const workshopPicRef = useRef<HTMLInputElement | null>(null)
    const [termsCheckbox, setTermsCheckbox] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [coverImg, setCoverImg] = useState<string>('')
    const [form, setForm] = useState<FormInterface>({
        workshop_manager_name: "",
        workshop_name: "",
        short_description: "",
        detailed_description: "",
        date: ""
    })
    const [formErrors, setFormErrors] = useState({
        workshop_name: {success: true, message: ""},
        short_description: {success: true, message: ""},
        detailed_description: {success: true, message: ""},
        date: {success: true, message: ""},
        coverImg: {success: true, message: ""},
        checkbox: {success: true, message: ""},
    })

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
            date: {success: !!form.date, message: "Please, enter date!"},
            detailed_description: {success: !!form.detailed_description, message: "Please, enter detailed description!"},
            short_description: {success: !!form.short_description, message: "Please, enter short description!"},
            coverImg: {success: !!coverImg.length, message: "Please, enter cover image!"},
            checkbox: {success: termsCheckbox, message: "Please, accept Terms and Conditions!"}
        })
        if(!!form.workshop_name && !!form.date && !!form.detailed_description && !!form.short_description && !!coverImg && termsCheckbox) {
            return true
        }
        return false
    }

    const handleSubmit = async () => {

        if(!validate()) {
            return;
        }
        if(!!form.workshop_manager_name === false) {
            setForm(prev => ({...prev, workshop_manager_name: user.displayName}))
        }
        setLoading(true)
        try {        
            const newWorkshopId = md5(`${form.workshop_name}.${new Date().getTime().toString()}`)
            const newWorkshopDocRef = doc(firestore, "workshops", newWorkshopId);
            await runTransaction(firestore, async (transaction) => {
                const photoURL = await updateImage(coverImg, newWorkshopId)
                transaction.set(newWorkshopDocRef, {
                    ...form,
                    cover_img: photoURL,
                    workshop_manager_id: user?.id,
                    category: "workshop",
                    isVerified: false
                });
                transaction.set(
                    doc(firestore, `users/${user?.id}/workshops`, newWorkshopId), {
                        workshopId: newWorkshopId,
                        isModerator: true,
                        isVerified: false
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
    }

    return (
        <Flex align="flex-start" w="100%" mt="2rem" direction="column" gap="1rem">
            <FormItem
            label='Your Name'
            isOptional={true}
            description='Giving your name provides a more trustworthy environment for participants, otherwise your username will be used.'
            >
                <InputItem type='text' name='workshop_manager_name' onChange={onChange} />
            </FormItem>
            <FormItem error={!formErrors.workshop_name.success} errorMessage={formErrors.workshop_name.message}  label='Workshop Name' description='Choosing an interesting workshop name will help you attract more participants.'>
                <InputItem type='text' name='workshop_name' onChange={onChange} />
            </FormItem>
            <FormItem error={!formErrors.short_description.success} errorMessage={formErrors.short_description.message} label='Short Description' description='The short description is where users first interact with you.'>
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
                    onChange={(ev) => onChange({ target: { name: ev.target.name, value: ev.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
            </FormItem>
            <FormItem error={!formErrors.detailed_description.success} errorMessage={formErrors.detailed_description.message} label='Detailed Description' description='A detailed description can be really helpful in directing the right users to attend the workshop, while also preventing irrelevant people from attending. This can make the workshop more productive and efficient.' isFormElement={false}>
                <TextEditor onChange={(_, data) => onChange({ target: { name: 'detailed_description', value: data } } as React.ChangeEvent<HTMLInputElement>)} value={form.detailed_description} />
            </FormItem>
            <FormItem  error={!formErrors.date.success} errorMessage={formErrors.date.message} label='Date and Time' description='Workshops prepared on weekends and outside working hours reach more users'>
                <InputItem type='datetime-local' name='date' onChange={onChange} />
            </FormItem>
            <FormItem error={!formErrors.coverImg.success} errorMessage={formErrors.coverImg.message} label='Cover Photo' isFormElement={false}>
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
            </FormItem>
            <Flex gap="0.4rem" align="center" direction="column">
                {!formErrors.checkbox.success && <Text fontSize="12px" color="red" fontStyle="italic">{formErrors.checkbox.message}</Text>}
                <Checkbox
                    iconColor='blue.500'
                    _checked={{ "& .chakra-checkbox__control": { background: "unset" } }}
                    onChange={ev => setTermsCheckbox(ev.target.checked)}
                >
                    <Text color="gray">Accept <Link to={"/"} style={{ color: "blue" }}>Terms & Conditions</Link></Text>
                </Checkbox>
            </Flex>
            <Button w={"100%"} onClick={handleSubmit}>
                {loading ? <Spinner /> : "Submit"}
            </Button>
        </Flex>
    )
}

export default CreateWorkshopForm