import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import {auth} from "../../../../firebaseClient"
import GoogleLogo from "../../../../assets/images/google-logo.png"
import { setModal } from "../../../../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { getUser, saveUserToFirestore } from "../../../../Helpers/apiFunctions";

type AuthButtonsProps = {};

const AuthButtons: React.FC<AuthButtonsProps> = () => {
  const dispatch = useDispatch()
  const [user] = useAuthState(auth)
  const [isGoogleAuth, setIsGoogleAuth] = useState(false)
  const [signInWithGoogle, _, loading, error] = useSignInWithGoogle(auth);


  const googleAuth = () => {
    setIsGoogleAuth(true)
    signInWithGoogle()
  }

  useEffect(() => {
    if(user?.uid && isGoogleAuth) {
      saveUserToFirestore("google", user)
       .then(() => {
        getUser(user.uid)
        dispatch(setModal({ isOpen: true, view: "editProfile" }))
      })
    }
  }, [user])
  
  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        onClick={googleAuth}
        isLoading={loading}
      >
        <Image src={GoogleLogo} height="20px" mr={4} alt="GOOGLE_LOGO"/>
        Continue with Google
      </Button>
      {error && (
        <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
          {error.toString()}
        </Text>
      )}
    </Flex>
  );
};
export default AuthButtons;
