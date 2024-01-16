import { Flex, Image } from '@chakra-ui/react'
import LogoHorizontal from '../../../assets/Logo/logo-horizontal.png'
import { Link } from 'react-router-dom'
const NavLogo = () => {
    return (
        <Link to="/">
            <Flex
                align="center"
                width={{ base: "150px", md: "auto" }}
                mr={{ base: 0, md: 2 }}
                cursor="pointer"
            >
                <Image src={LogoHorizontal} width={150} />
            </Flex>
        </Link>
    )
}

export default NavLogo