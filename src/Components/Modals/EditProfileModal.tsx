import { Button, Divider, Flex, Input, ModalBody, ModalCloseButton, ModalHeader, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { auth, firestore, storage } from '../../firebaseClient'
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth'
import { SCEditButton, SCFormItem, SCIcon } from '../SCElements'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { getPexelPhoto } from '../../pexelsClient'
import { doc, updateDoc } from 'firebase/firestore'
import NotFoundUserPic from '../../assets/images/user.png'
import { updateUser } from '../../Helpers/apiFunctions'

const EditProfileModal = () => {

    const toast = useToast()
    const [user] = useAuthState(auth)
    const [updateProfile, error] = useUpdateProfile(auth);
    const profileImgInputRef = useRef<HTMLInputElement | null>(null)
    const coverImgInputRef = useRef<HTMLInputElement | null>(null)
    const [imageLoading, setImageLoading] = useState<{status: boolean, type: string}>({status: false, type: ''})
    const [isSaving, setIsSaving] = useState(false)
    const [coverPhoto, setCoverPhoto] = useState<any>()
    const [formValues, setFormValues] = useState({
        email: user?.email,
        username: user?.email?.split("@")[0],
        displayName: user?.displayName,
        phoneNumber: user?.phoneNumber
    })

    const getCoverPhoto = async () => {
        const image = await getPexelPhoto("cover photo")
        setCoverPhoto(image?.src?.original as string)
    }

    useEffect(() => {
        getCoverPhoto()
    }, [])


    const onImgChange = (event: ChangeEvent<HTMLInputElement>, type: string = "profile_photo") => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
            updateImage(readerEvent.target?.result as string, type)
        }
        };
    }

    const updateImage = async (img: string, type: string) => {

        setImageLoading({status: true, type: type})
        try {
            const imageRef = ref(storage, `users/${user?.uid}/${type}`);
            await uploadString(imageRef, img, "data_url");
            const photoURL = await getDownloadURL(imageRef);
            if(type === "profile_photo") {
                if(user?.providerData[0].providerId.includes("google")) {
                    await updateProfile({ photoURL })
                    error && toast({
                        title: "Try Again later..",
                        status: "error",
                        isClosable: true,
                      })
                }else{
                    user && await updateDoc(doc(firestore, "users", user?.uid), {
                        profilePhotoURL: photoURL,
                      });
                }
            } else {
                user && await updateDoc(doc(firestore, "users", user?.uid), {
                    coverPhotoURL: photoURL,
                  });
            }
        } catch (error: any) {
          console.log("updateImage error", error.message);
        } finally {
            setImageLoading({status: false, type: ''});
        }
      };

      const editUserInfo = async () => {
        setIsSaving(true)
        try {
            user && await updateUser(user?.uid, formValues)
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setIsSaving(false)
        }
      }

      const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target
        setFormValues(prev => ({ ...prev, [name]: value }))
      }


    const ImageSpinner = () => {
        return (
            <Flex
            position={"relative"}
            top={0}
            left={12}
            bg="gray.200"
            borderRadius={32}
            width={"32px"}
            height={"32px"}
            alignItems={"center"}
            justifyContent={"center"}
            border={"2px solid"}
            borderColor={"white"}
            >
                <Spinner />
            </Flex>
        )
    }

  return (  
    <ModalLayout>
        <ModalHeader display="flex" flexDirection="column" alignItems="center">
            EditProfile
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
                justifyContent="flex-start"
                width={"100%"}
            >
                <Flex bgImage={coverPhoto} w={"100%"} h={"fit-content"} borderRadius={5} justifyContent={"center"} alignItems={"center"}>
                    <SCFormItem type='img' src={user?.photoURL as string ?? NotFoundUserPic} additionalStyles={{transform: "translateY(40px)"}}/>
                    <input type='file' style={{display: 'none'}} accept="image/x-png,image/gif,image/jpeg" ref={profileImgInputRef} onChange={ev => onImgChange(ev, "profile_photo")}/>
                    <input type='file' style={{display: 'none'}} accept="image/x-png,image/gif,image/jpeg" ref={coverImgInputRef} onChange={ev => onImgChange(ev, "cover_photo")}/>
                </Flex>
                {imageLoading.status && imageLoading.type === "profile_photo" ? <ImageSpinner /> : <SCEditButton onEdit={() => profileImgInputRef?.current && profileImgInputRef?.current?.click()} position='relative' top={-8} left={79} transform='translate(-2rem, 2rem)'/>}
                {imageLoading.status && imageLoading.type === "cover_photo" ? <ImageSpinner /> : <SCEditButton onEdit={() => coverImgInputRef?.current && coverImgInputRef?.current?.click()} transform='translate(12rem, -10rem)'/>}
                <Divider mb={6} w="50%" />
                <SCFormItem placeholder={user?.email as string} label='E-mail' name="email" onChange={handleChange}/>
                <SCFormItem placeholder={user?.email?.split("@")[0] as string} label='Username' name="username" onChange={handleChange}/>
                <Divider mt={1} mb={3}/>
                <SCFormItem placeholder={user?.displayName as string} label='Display Name' name="displayName" onChange={handleChange}/>
                <SCFormItem placeholder={user?.phoneNumber as string} label='Phone Number' name="phoneNumber" onChange={handleChange}/>
                <Flex w={"100%"} justifyContent={"flex-end"} mt={3}>
                    <Button px={10} onClick={() => editUserInfo()}>
                        {isSaving ? <Spinner /> : "Save"}
                    </Button>
                </Flex>
            </Flex>
        </ModalBody>
    </ModalLayout>
  )
}

export default EditProfileModal