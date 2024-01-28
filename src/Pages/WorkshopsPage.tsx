import { PageLayout } from '../Layouts'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import communitiesBackground from '../assets/images/communities.jpg'
import WorkshopImg from '../assets/images/workshop.jpg'
import Avatar from '../assets/images/avatar.jpeg'
import { WorkshopCard } from '../Components'
import { useState } from 'react'
import { Workshop } from '../Interface/WorkshopInterface'

const WorkshopsPage = () => {

  const [selected, setSelected] = useState<Workshop | undefined>()

  const dummy = [
    {
      id: 0,
      name: "Navigating Life With ADHD",
      manager: "John Doe",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 1,
      name: "Navigating Life With ADHD",
      manager: "John Doe",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 2,
      name: "Navigating Life With ADHD",
      manager: "John Doe",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 3,
      name: "Navigating Life With ADHD",
      manager: "John Doe",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 4,
      name: "Navigating Life With ADHD",
      manager: "John Doe",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    }
  ]

  return (
    <PageLayout showSidebar={false} leftWidth="100%">
      <>
        <Flex
          p={1}
          w="100%"
          h="fit-content"
          bg="white"
          flexDirection="column"
          display="flex"
        >
          <Flex
            align="flex-end"
            color="white"
            bg="blue.500"
            height={["150px", "250px"]}
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
              color="white"
              p="6px 10px"
              bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
            >
              <Flex width="100%" height={"50%"} justify="space-between" align={["flex-start", "flex-end"]} direction={["column", "row"]}>
                <Text fontSize={18} fontWeight={700}>
                  Workshops
                </Text>
                <Button>
                  I wan’t to be a workshop manager!
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex direction="row" padding="1rem">
            <Flex direction="row" align="flex-start" gap="1rem" w="50%" flexWrap="wrap">
              {dummy.map((workshop: Workshop, idx) => <WorkshopCard key={idx} workshop={workshop} selected={selected} setSelected={setSelected} />)}
            </Flex>
            <Flex w="50%" align="flex-start" justify="flex-start" direction="column" bg="gray.100" borderRadius="16px">
              <Flex
                w="100%"
                align="flex-end"
                color="white"
                bg="blue.500"
                height={"150px"}
                borderRadius="16px 16px 0px 0px"
                fontWeight={600}
                backgroundSize="cover"
                bgPos={"center"}
                bgImage={WorkshopImg}
              >
                <Flex
                  width="100%"
                  height="100%"
                  align="flex-end"
                  color="white"
                  p="6px 10px"
                  bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
                >
                  <Flex width="100%" justify="space-between" align="flex-end" direction="row">
                    <Box>
                      <Text fontSize={22} fontWeight={700} marginBottom="0.3rem">
                        {selected?.name}
                      </Text>
                      <Box bg="white" w="fit-content" h="fit-content" p="0.2rem 0.6rem" borderRadius="99px">
                        <Text fontWeight="600" color="black">
                          {selected?.category}
                        </Text>
                      </Box>
                    </Box>
                    <Flex align="center" gap={"0.7rem"}>
                      <Image src={Avatar} w="30px" borderRadius="30px" />
                      {selected?.manager}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex p="1rem">
                asd
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </>
      <>
      </>
    </PageLayout>
  )
}

export default WorkshopsPage
