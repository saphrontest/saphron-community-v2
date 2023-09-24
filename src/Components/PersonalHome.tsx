import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import WelcomePicture from "../assets/images/welcome.png"
import { setModal } from '../redux/slices/modalSlice'
const PersonalHome = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            cursor="pointer"
            border="1px solid"
            borderColor="gray.300"
            position="sticky"
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
                    <Button height="30px" onClick={() => navigate("submit")}>Create Post</Button>
                    <Button variant="outline" height="30px" onClick={() => dispatch(setModal({ isOpen: true, view: "addCommunity" }))}>
                        Create Community
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    )
}

export default PersonalHome