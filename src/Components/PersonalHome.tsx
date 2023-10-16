import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import WelcomePicture from "../assets/images/welcome.png"
import { setModal } from '../redux/slices/modalSlice'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebaseClient'
const PersonalHome = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useToast()

    const handleButton = (type: string = "add-community") => {
        if(!!user === false) {
            toast({
                title: "Please login, first!",
                status: "error",
                isClosable: true,
                position: "top-right"
            })
            return;
        }
        if(type === "create-post") {
            navigate("submit")
        } else {
            dispatch(setModal({ isOpen: true, view: "addCommunity" }))
        }
    }

    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            cursor="pointer"
            border="1px solid"
            borderColor="gray.300"
            position="sticky"
            mb={3}
        >
            <Flex
                align="flex-end"
                color="white"
                p="6px 10px"
                bg="blue.500"
                height="34px"
                borderRadius="4px 4px 0px 0px"
                fontWeight={600}
                bgImage={WelcomePicture}
                backgroundSize="cover"
            ></Flex>
            <Flex direction="column" p="12px">
                <Flex align="center" mb={2}>
                    <Text fontWeight={600}>Home</Text>
                </Flex>
                <Stack spacing={3}>
                    <Text fontSize="9pt">
                        Your personal <strong>Saphron Health</strong> frontpage, built for you.
                    </Text>
                    <Button height="30px" onClick={() => handleButton("create-post")}>Create Post</Button>
                    <Button variant="outline" height="30px" onClick={() => handleButton("add-community")}>
                        Create Community
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    )
}

export default PersonalHome