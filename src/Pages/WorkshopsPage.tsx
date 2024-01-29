import { PageLayout } from '../Layouts'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import communitiesBackground from '../assets/images/communities.jpg'
import WorkshopImg from '../assets/images/workshop.jpg'
import Avatar from '../assets/images/avatar.jpeg'
import { WorkshopCard } from '../Components'
import { useEffect, useState } from 'react'
import { Workshop } from '../Interface/WorkshopInterface'
import { useDispatch } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'

const WorkshopsPage = () => {

  const dispatch = useDispatch()
  const [selected, setSelected] = useState<Workshop | undefined>()

  useEffect(() => {
    setSelected(dummy[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      name: "Unwind Your Mind - An Anxiety Workshop",
      manager: "Alex Thompson",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 2,
      name: "Understanding Autism",
      manager: "Jamie Rodriguez",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 3,
      name: "Unlocking your potention",
      manager: "Jordan Reynolds",
      date: "21.04.2024",
      time: "12:00",
      category: "workshop"
    },
    {
      id: 4,
      name: "Overcoming Obsessive Compulsive Disorder",
      manager: "Morgan Anderson",
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
                <Button onClick={() => dispatch(setModal({isOpen: true, view: "createWorkshop"}))}>
                  I wan’t to be a workshop manager!
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex direction="row" padding="1rem">
            <Flex direction="row" align="flex-start" gap="1rem" w="50%" flexWrap="wrap">
              {dummy.map((workshop: Workshop, idx) => <WorkshopCard key={idx} workshop={workshop} selected={selected} setSelected={setSelected} />)}
            </Flex>
            <Flex w="50%" h="fit-content" align="flex-start" justify="flex-start" direction="column" bg="gray.100" borderRadius="16px">
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
                      <Text fontSize={22} fontWeight={700} marginBottom="0.3rem" align="left">
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
                      <Text align="left" noOfLines={1}>
                        {selected?.manager}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex p="1rem" direction="column">
                <Text fontWeight={700} align="left" mb="0.7rem">
                  {`${selected?.date} - ${selected?.time}`}
                </Text>
                <Text fontStyle="italic" align="left" mb="0.7rem">
                  Discover freedom from the grip of Obsessive-Compulsive Disorder. Our workshop provides
                  practical strategies, expert insights, and peer support to help you overcome OCD's
                  challenges. Join us on a journey to regain control and embrace a life of balance and tranquility.
                </Text>
                <Text align="left" fontWeight="600">
                  Embark on a transformative journey toward inner peace with our workshop,
                  'Overcoming Obsessive Compulsive Disorder.' This empowering session is designed to guide
                  participants through a comprehensive exploration of OCD, offering insights into the
                  complexities of the disorder while providing practical strategies for regaining control and
                  fostering a sense of calm.
                  <br />
                  Through a blend of expert guidance, peer support, and evidence-based techniques,
                  attendees will gain valuable tools to navigate the challenges of OCD, ultimately paving
                  the way towards a more balanced and fulfilling life. Join us as we unravel the layers of
                  OCD and embark on a path of understanding, acceptance, and triumph over intrusive
                  thoughts and compulsive behaviors.
                </Text>
                <Flex paddingY="1rem" w="100%" justify="flex-end">
                  <Button w="fit-content" h="fit-content" p="0.4rem 1.5rem">
                    I wan't to join!
                  </Button>
                </Flex>
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
