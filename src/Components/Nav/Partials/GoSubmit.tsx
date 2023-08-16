import { Flex, Icon } from '@chakra-ui/react'
import { GrAdd } from "react-icons/gr";

const GoSubmit = () => {
    return (
        <Flex alignItems="center" flexGrow={1}>
            <>
                <Flex
                    display={{ base: "none", md: "flex" }}
                    mr={3}
                    ml={1.5}
                    padding={1}
                    cursor="pointer"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                    onClick={() => console.log("go submit")}
                >
                    <Icon as={GrAdd} fontSize={20} />
                </Flex>
            </>
        </Flex>
    )
}

export default GoSubmit