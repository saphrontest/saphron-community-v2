import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import LogoHorizontal from '../../../assets/Logo/logo-horizontal.png'
import { Link, NavLink, useNavigate, Navigate } from 'react-router-dom'
const NavLogo = () => {

    return (
        <Flex
            align="center"
            width={{ base: "150px", md: "auto" }}
            mr={{ base: 0, md: 2 }}
            cursor="pointer"
        >
            <Image src={LogoHorizontal} width={150} />
        </Flex>
    )
}

export default NavLogo