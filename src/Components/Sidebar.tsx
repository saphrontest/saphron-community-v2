import { Box, Divider, Flex, Image, Link } from "@chakra-ui/react"
import { getPexelPhoto } from "../pexelsClient"
import { useEffect, useState } from "react"

const SideBar = () => {
    const [pexelPic, setPexelPic] = useState<any>()
    const Links = [
      {id: 0, name: "about", link: ""},
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
        w="20%"
        h="fit-content"
        display={{ base: "none", sm: "none", md: "flex" }}
        flexDirection="column"
        flexGrow={1}
        bg="white"
        p={1}
        pos="relative"
      >
        <Image src={pexelPic?.src?.original} h={"175px"}/>
        <Box pos="absolute" bottom={0} bg="white">
          <Divider />
          <Flex float="right" wrap="wrap">
            {Links.map((link, idx) => (
                <Flex key={idx} height="100%" alignItems="center">
                  <Link fontWeight={500} textTransform="capitalize" mr={1} color={"gray"}>{link.name}</Link>
                  {idx !== (Links.length - 1) && <span>.</span>}
                </Flex>
              ))
            }
          </Flex>
        </Box>
      </Flex>
    )
  }

  export default SideBar