import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react"

const SideBar = () => {
    const Links = [
      {id: 0, name: "about", link: ""},
      {id: 1, name: "careers", link: ""},
      {id: 2, name: "terms", link: ""},
      {id: 3, name: "privacy", link: ""}
    ]
  
    return (
      <Flex
        w="175px"
        h="400px"
        display={{ base: "none", sm: "none", md: "flex" }}
        flexDirection="column"
        flexGrow={1}
        bg="white"
        p={1}
        pos="relative"
      >
        <Text>TEXT</Text>
        <Box pos="absolute" bottom={0}>
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