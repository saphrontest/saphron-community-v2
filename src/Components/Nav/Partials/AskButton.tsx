import { Flex, Text } from '@chakra-ui/react'
import { GrAdd } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

const AskButton = () => {
    const navigate = useNavigate()
    return (
        <Flex alignItems="center" flexGrow={1}>
            <Flex
                minH="34px"
                minW="34px"
                justify="center"
                align="center"
                gap={2}
                mr={3}
                ml={1.5}
                paddingX={2}
                cursor="pointer"
                borderRadius={4}
                outline={"1px solid"}
                outlineColor={"gray.100"}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                onClick={() => navigate("/submit")}
            >
                <GrAdd  fontSize={18} className='AddButton' color='gray.500'/>
                <Text display={{ base: "none", md: "flex" }} fontSize={16} fontWeight={500} color="gray.500">
                    Ask Question
                </Text>
            </Flex>
        </Flex>
    )
}

export default AskButton