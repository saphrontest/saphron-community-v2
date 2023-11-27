import { Box, Flex, Input, ModalBody, ModalCloseButton, ModalHeader, Text } from '@chakra-ui/react'
import React, { Fragment, useRef } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { auth } from '../../firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { SCEditButton, SCFormItem, SCIcon } from '../SCElements'

const EditProfileModal = () => {

    const [user] = useAuthState(auth)
    const imgInputRef = useRef<HTMLInputElement | null>(null)
    const onImgChange = (e: HTMLInputElement) => {
        console.log(e)
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
                <Box style={{ padding: 10 }}>
                    <SCFormItem type='img' src={user?.photoURL as string} />
                    <SCEditButton onEdit={() => imgInputRef?.current && imgInputRef?.current?.click()} position='relative' top={-8} left={79}/>
                    <input type='file' style={{display: 'none'}} ref={imgInputRef} onChange={onImgChange}/>
                </Box>
                <SCFormItem placeholder={user?.displayName as string} label='Display Name'/>
                <SCFormItem placeholder={user?.email as string} label='E-mail'/>
                
            </Flex>
        </ModalBody>
    </ModalLayout>
  )
}

export default EditProfileModal