import { Button, Flex, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { InputItem } from '../../../Layouts'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../../firebaseClient'
import { FirestoreError } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { setModal } from '../../../redux/slices/modalSlice'

const ResetPassword = () => {
    const toast = useToast()
    const dispatch = useDispatch()
    const [email, setEmail] = useState<string>('')

    const resetPassword = async () => {
        if(email.length) {
            try {
                await sendPasswordResetEmail(auth, email)
                toast({
                    title: 'Reset Password mail sent.',
                    description: 'Please go check your inbox.',
                    status: 'info',
                    isClosable: true
                });
                dispatch(setModal({
                    isOpen: true,
                    view: 'login',
                    data: { email }
                }))
            } catch (error) {
                if(error instanceof FirestoreError) {
                    console.error(error.message)
                    toast({ title: error.message, status: "error", isClosable: true });
                }
            }
        }
    }

    return (
        <Flex w="100%" direction="column" gap="1rem">
            <Text fontWeight={700}>
                E-mail
            </Text>
            <InputItem type='email' name='email' onChange={ev => setEmail(ev.target.value)}/>
            <Flex direction="row" gap="0.4rem" mt="1rem">
                <Button flex={1} onClick={resetPassword}>
                    Reset
                </Button>
                <Button flex={1} variant='outline'>
                    Cancel
                </Button>
            </Flex>
        </Flex>
    )
}

export default ResetPassword
