import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { getPexelPhoto } from "../pexelsClient"
import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"

const SideBar = () => {
    const [pexelPic, setPexelPic] = useState<any>()
    const Links = [
      {id: 0, name: "about", link: "/about"},
      {id: 1, name: "careers", link: ""},
      {id: 2, name: "terms", link: ""},
      {id: 3, name: "privacy", link: ""}
    ]

    const getPexel = async () => {
      const photo = await getPexelPhoto("square pic about menthal health")
      setPexelPic(photo)
    }

    useEffect(() => {
      getPexel() 
    }, [])
  
    return (
      <Flex
        p={1}
        w="100%"
        display={{ base: "none", sm: "none", md: "flex" }}
        flexDirection="column"
        bg="white"
        pos="relative"
      >
        <Image src={pexelPic?.src?.original} h={"175px"}/>
        <Box pos="absolute" bottom={0} bg="white">
          <Divider />
          <Flex float="right" wrap="wrap">
            {Links.map((link, idx) => (
              <Fragment key={idx}>
                <Link to={link.link}>
                  <Flex height="100%" alignItems="center" _hover={{textDecoration: "underline"}}>
                    <Text fontWeight={500} textTransform="capitalize" mr={1} color={"gray"}>{link.name}</Text>
                    {idx !== (Links.length - 1) && <span>.</span>}
                  </Flex>
                </Link>
                </Fragment>
              ))
            }
          </Flex>
        </Box>
      </Flex>
    )
  }

  export default SideBar