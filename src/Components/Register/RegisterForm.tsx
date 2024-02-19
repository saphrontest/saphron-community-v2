import React from 'react'
import { InputItem } from '../../Layouts'
import { Button, Flex, Text } from '@chakra-ui/react'
import { ModalViewTypes } from '../../Interface'

interface RegisterFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onChange: ({target: { name, value }}: React.ChangeEvent<HTMLInputElement>) => void
    toggleView: (view: ModalViewTypes) => void
    loading: boolean 
}

const RegisterForm = ({ onSubmit, onChange, loading, toggleView }: RegisterFormProps) => {
  return (
    <form onSubmit={onSubmit}>
        <InputItem
          name="email"
          placeholder="email"
          type="text"
          mb={2}
          onChange={onChange}
        />
        <InputItem
          name="password"
          placeholder="password"
          type="password"
          mb={2}
          onChange={onChange}
        />
        <InputItem
          name="confirmPassword"
          placeholder="confirm password"
          type="password"
          onChange={onChange}
        />
        <Button
          width="100%"
          height="36px"
          mb={2}
          mt={2}
          type="submit"
          isLoading={loading}
        >
          Sign Up
        </Button>
        <Flex fontSize="9pt" justifyContent="center">
          <Text mr={1}>Have an account?</Text>
          <Text
            color="blue.500"
            fontWeight={700}
            cursor="pointer"
            onClick={() => toggleView("login")}
          >
            LOG IN
          </Text>
        </Flex>
      </form>
  )
}

export default RegisterForm
