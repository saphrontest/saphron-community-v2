import { Flex } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import Login from './Login'
import SignUp from './SignUpForm'

const AuthInputs = () => {
    const modal = useSelector((state: RootState) => state.modal)
    return (
        <Flex direction="column" alignItems="center" width="100%" mt={4}>
            {modal.view === "login" ? (
                <Login />
            ) : (
                <SignUp />
            )}
        </Flex>
    )
}

export default AuthInputs