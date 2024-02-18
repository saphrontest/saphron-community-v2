import { MenuItem, Flex, Icon } from "@chakra-ui/react"
import { FC } from "react"
import { MdOutlineLogin } from "react-icons/md"

const LoginButton: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <MenuItem
            fontSize="10pt"
            fontWeight={700}
            _hover={{ bg: "blue.500", color: "white" }}
            onClick={onClick}
        >
            <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log In / Sign Up
            </Flex>
        </MenuItem>
    )
}

export default LoginButton
