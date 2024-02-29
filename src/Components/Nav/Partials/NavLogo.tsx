import { Flex, Image } from '@chakra-ui/react'
import LogoHorizontal from '../../../assets/Logo/logo-horizontal.png'
import LogoIcon from '../../../assets/Logo/logo-icon.png'
import { Link } from 'react-router-dom'
import { useMediaQuery } from '@chakra-ui/react'
const NavLogo = () => {
    const [isBase] = useMediaQuery('(max-width: 30em)')
    return (
        <Link to="/">
            <Flex
                h="100%"
                align="center"
                justify="center"
                cursor="pointer"
                mr={{ base: 0, md: 2 }}
            >
                {isBase ? <Image src={LogoIcon} w="30px"/> : <Image src={LogoHorizontal} width={150} />}
            </Flex>
        </Link>
    )
}

export default NavLogo