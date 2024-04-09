import { useAuthState, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { auth } from "../../../../firebaseClient";
import { InputItem } from "../../../../Layouts";
import { useDispatch } from "react-redux";
import { setModal } from "../../../../redux/slices/modalSlice";
import { ModalViewTypes } from "../../../../Interface";
import { getUser } from "../../../../Helpers/apiFunctions";

type LoginProps = {
  data: any;
};

const Login: React.FC<LoginProps> = ({ data }) => {
  const dispatch = useDispatch()
  const [isLoginSuccess, setLoginSuccess] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [user] = useAuthState(auth)
  const toggleView = (view: ModalViewTypes) => dispatch(setModal({isOpen: true, view: view}));

  const [signInWithEmailAndPassword, _, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }

    signInWithEmailAndPassword(form.email, form.password);
    if(error){
      setFormError("Invalid email or password!");
    }else{
      setLoginSuccess(true)
    }
  };
  
  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    if(isLoginSuccess && user) {
      getUser(user?.uid).then(() => dispatch(setModal({isOpen: false, view: null})))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoginSuccess])

  useEffect(() => {
    if(data) {
      setForm(prev => ({...prev, email: data.email}))
    }
  }, [data])

  return (
    <>
    {
      formError && <Text
        color="red.600"
        fontWeight={500}
        paddingBottom={3}
      >
        {formError}
      </Text>
    }
    <form onSubmit={onSubmit}>
      <InputItem
        name="email"
        placeholder={"email"}
        value={form.email || ''}
        type="text"
        mb={2}
        onChange={onChange}
      />
      <InputItem
        name="password"
        placeholder="password"
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
        Log In
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() => toggleView("resetPassword")}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => toggleView("signup")}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>

    </>
  );
};
export default Login;
