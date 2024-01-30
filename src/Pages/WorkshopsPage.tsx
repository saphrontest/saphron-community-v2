import { PageLayout } from '../Layouts'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import communitiesBackground from '../assets/images/communities.jpg'
import Avatar from '../assets/images/avatar.jpeg'
import { WorkshopCard } from '../Components'
import { useEffect, useState } from 'react'
import { Workshop } from '../Interface/WorkshopInterface'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { getWorkshops } from '../Helpers'
import moment from 'moment'
import { UserInterface } from '../Interface/UserInterface'
import { RootState } from '../redux/store'

const WorkshopsPage = () => {

  const user: UserInterface = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [selected, setSelected] = useState<Workshop | undefined>()
  const [workshops, setWorkshops] = useState<Workshop[]>([])

  const getWorkshopList = async () => {
    const data = await getWorkshops()
    data && setWorkshops(data)
  }

  useEffect(() => {
    getWorkshopList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    !!selected === false && setSelected(workshops[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshops])

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
                <Text fontSize={24} fontWeight={700}>
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
              {workshops.map((workshop: Workshop, idx: number) => <WorkshopCard key={idx} workshop={workshop} selected={selected} setSelected={setSelected} />)}
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
                bgImage={selected?.cover_img}
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
                        {selected?.workshop_name}
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
                        {selected?.workshop_manager_name}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex p="1rem" direction="column">
                <Text fontWeight={700} align="left" mb="0.7rem">
                  {selected?.date && moment(new Date(selected?.date)).format("DD.MM.YYYY hh:mm")}
                </Text>
                <Text fontStyle="italic" align="left" mb="0.7rem">
                  {selected?.short_description}
                </Text>
                {selected?.detailed_description && <Text align="left" fontWeight="600" dangerouslySetInnerHTML={{ __html: selected?.detailed_description }}/>}
                {selected?.workshop_manager_id !== user.id && <Flex paddingY="1rem" w="100%" justify="flex-end">
                  <Button w="fit-content" h="fit-content" p="0.4rem 1.5rem" onClick={() => dispatch(setModal({ isOpen: true, view: "joinWorkshop", data: selected }))}>
                    I wan't to join!
                  </Button>
                </Flex>}
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
