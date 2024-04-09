import { ModalLayout } from '../../Layouts'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Flex, ModalBody, ModalCloseButton, ModalHeader } from '@chakra-ui/react'
import { AuthView, ResetPassword } from './Views'

const AuthModal = () => {
    const modal = useSelector((state: RootState) => state.modal)
    return (
        <ModalLayout>
            <ModalHeader display="flex" flexDirection="column" alignItems="center">
                {modal.view === "login" && "Login"}
                {modal.view === "signup" && "Sign Up"}
                {modal.view === "resetPassword" && "Reset Password"}
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
                    justifyContent="center"
                    width="70%"
                >
                    
                    {modal.view === "login" || modal.view === "signup" ? (
                        <AuthView />
                    ) : (
                        <ResetPassword />
                    )}
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default AuthModal