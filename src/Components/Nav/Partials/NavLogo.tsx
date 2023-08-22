import { Flex, Image } from '@chakra-ui/react'
import LogoHorizontal from '../../../assets/Logo/logo-horizontal.png'
import { useNavigate } from 'react-router-dom'
const NavLogo = () => {
    const navigate = useNavigate()
    return (
        <Flex
            align="center"
            width={{ base: "150px", md: "auto" }}
            mr={{ base: 0, md: 2 }}
            cursor="pointer"
            onClick={() => navigate("/")}
        >
            <Image src={LogoHorizontal} width={150} />
        </Flex>
    )
}

export default NavLogo