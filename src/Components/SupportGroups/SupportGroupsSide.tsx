import { Button, Flex, Text } from '@chakra-ui/react'
import menthalBackground from '../../assets/images/menthal.jpg'
import { useNavigate } from 'react-router-dom'

const SupportGropsSide = () => {
  
  const navigate = useNavigate()
  
  return (
    <Flex
      p={1}
      w="100%"
      h="fit-content"
      bg="white"
      flexDirection="column"
      display={{ base: "none", sm: "none", md: "flex" }}
    >
      <Flex
        align="flex-end"
        color="white"
        bg="blue.500"
        height="100px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        backgroundSize="cover"
        bgPos={"center"}
        bgImage={menthalBackground}
      >
        <Flex
          width="100%"
          height="100%"
          align="flex-end"
          color="white"
          p="6px 10px"
          bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
        >
          Support Groups
        </Flex>
      </Flex>
      <Flex direction="column" padding="1rem 0.4rem">
        <Text align="left" fontWeight={600}>
          Find support in our Mental Health Groups.
          Join us on the journey to well-being, where
          you're not alone. Together, let's navigate
          towards healing and empowerment.
        </Text>
        <Button
        marginTop="1rem"
        paddingY="0.5rem"
        height="fit-content"
        onClick={() => navigate("/support-groups")}
        >
          Show All Groups
        </Button>
      </Flex>
    </Flex>
  )
}

export default SupportGropsSide