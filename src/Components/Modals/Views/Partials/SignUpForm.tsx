import React, { useEffect, useState } from "react";
import { Text, useToast } from "@chakra-ui/react";
import { useAuthState, useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebaseClient";
import { useDispatch } from "react-redux";
import { setModal } from "../../../../redux/slices/modalSlice";
import { ModalViewTypes } from "../../../../Interface/ModalInterface";
import RegisterForm from "../../../Register/RegisterForm";
import { getUser, saveUserToFirestore } from "../../../../Helpers/apiFunctions";
import { sendEmailVerification } from "firebase/auth";

type SignUpProps = {

};

const SignUp: React.FC<SignUpProps> = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const [user] = useAuthState(auth)
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmit, setIsSubmit] = useState(false)
  const [createUserWithEmailAndPassword, _, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

    useEffect(() => {

      if(!isSubmit) return;

      if(authError?.message){
        setIsSubmit(false)
        const message = authError.code === "auth/weak-password" ? "Password should be at least 6 characters." : authError.code === "auth/email-already-in-use" ? "Email already in use. Please try different email." : "Please try again later."
        setFormError(message as string);
      } else {
        user?.uid && saveUserToFirestore(null, user).then(() => {
          sendEmailVerification(user).then(() => {
            toast({
              title: "Please, check your email to complete verification.",
              status: "warning",
              isClosable: true,
            })
          })
          getUser(user?.uid)
          toggleView("editProfile")
        })
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authError, isSubmit])

    const toggleView = (view: ModalViewTypes) => dispatch(setModal({isOpen: true, view: view}));

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }

    if (form.password !== form.confirmPassword) {
      return setFormError("Passwords do not match");
    }

    await createUserWithEmailAndPassword(form.email, form.password)
    setIsSubmit(true);

  };

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      <RegisterForm onChange={onChange} onSubmit={onSubmit} toggleView={toggleView} loading={loading} />
    </>
  );
};
export default SignUp;
