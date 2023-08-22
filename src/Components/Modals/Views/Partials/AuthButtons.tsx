import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import {auth} from "../../../../firebaseClient"
import GoogleLogo from "../../../../assets/images/google-logo.png"
import { setModal } from "../../../../redux/slices/modalSlice";
import { useDispatch } from "react-redux";

type AuthButtonsProps = {};

const AuthButtons: React.FC<AuthButtonsProps> = () => {
  const dispatch = useDispatch()
  const [signInWithGoogle, _, loading, error] = useSignInWithGoogle(auth);

  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        onClick={async () => signInWithGoogle().then(() => dispatch(setModal({isOpen: false, view: null})))}
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
