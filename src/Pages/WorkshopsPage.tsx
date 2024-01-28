import { PageLayout } from '../Layouts'
import { Flex, Text } from '@chakra-ui/react'
import communitiesBackground from '../assets/images/communities.jpg'
const WorkshopsPage = () => {

  return (
    <PageLayout showSidebar={false} leftWidth="90%">
      <>
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
            height="150px"
            borderRadius="4px 4px 0px 0px"
            fontWeight={600}
            backgroundSize="cover"
            bgPos={"center"}
            bgImage={communitiesBackground}
          >
            <Flex
              width="100%"
              height="100%"
              align="flex-end"
              justify="space-between"
              color="white"
              p="6px 10px"
              bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
            >
              <Text>
                Workshops
              </Text>
              <Text>
                Workshops
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column">

          </Flex>
        </Flex>
      </>
      <>
      </>
    </PageLayout>
  )
}

export default WorkshopsPage
