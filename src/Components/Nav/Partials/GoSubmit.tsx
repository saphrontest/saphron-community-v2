import { Flex, Icon } from '@chakra-ui/react'
import { GrAdd } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

const GoSubmit = () => {
    const navigate = useNavigate()
    return (
        <Flex alignItems="center" flexGrow={1}>
            <Flex
                display={{ base: "none", md: "flex" }}
                mr={3}
                ml={1.5}
                padding={1}
                cursor="pointer"
                borderRadius={4}
                _hover={{ bg: "gray.200" }}
                onClick={() => navigate("/submit")}
            >
                <Icon as={GrAdd} fontSize={20} color="red.100"/>
            </Flex>
        </Flex>
    )
}

export default GoSubmit