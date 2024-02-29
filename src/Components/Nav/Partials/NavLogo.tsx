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
                align="center"
                justify="center"
                h="100%"
                mr={{ base: 0, md: 2 }}
                cursor="pointer"
            >
                {isBase ? <Image src={LogoIcon} w="56px"/> : <Image src={LogoHorizontal} width={150} />}
            </Flex>
        </Link>
    )
}

export default NavLogo