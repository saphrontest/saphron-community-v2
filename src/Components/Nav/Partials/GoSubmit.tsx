import { Flex, Icon, Text } from '@chakra-ui/react'
import { GrAdd } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

const GoSubmit = () => {
    const navigate = useNavigate()
    return (
        <Flex alignItems="center" flexGrow={1}>
            <Flex
                display={{ base: "none", md: "flex" }}
                justify="center"
                align="center"
                gap={2}
                mr={3}
                ml={1.5}
                padding={1}
                cursor="pointer"
                borderRadius={4}
                outline={"1px solid"}
                outlineColor={"gray.100"}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                onClick={() => navigate("/submit")}
            >
                <Icon as={GrAdd} fontSize={20} color="red.100"/>
                <Text fontSize={16} fontWeight={500} color="black.500">
                    Ask Question
                </Text>
            </Flex>
        </Flex>
    )
}

export default GoSubmit