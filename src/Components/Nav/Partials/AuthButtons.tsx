import { Button } from '@chakra-ui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setModal } from '../../../redux/slices/modalSlice'

const AuthButtons = () => {
    const dispatch = useDispatch()
    return (
        <>
            <Button
                variant="outline"
                height="28px"
                display={{ base: "none", sm: "flex" }}
                width={{ base: "70px", md: "110px" }}
                mr={2}
                onClick={() => dispatch(setModal({ isOpen: true, view: "login" }))}
            >
                Log In
            </Button>
            <Button
                variant="solid"
                height="28px"
                display={{ base: "none", sm: "flex" }}
                width={{ base: "70px", md: "110px" }}
                mr={2}
                onClick={() => dispatch(setModal({ isOpen: true, view: "signup" }))}
            >
                Sign Up
            </Button>
        </>
    )
}

export default AuthButtons