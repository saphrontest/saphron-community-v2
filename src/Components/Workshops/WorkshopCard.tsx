import { Box, Flex, Image, Text } from '@chakra-ui/react'
import WorkshopImg from '../../assets/images/workshop.jpg'
import { FC } from 'react'
import { Workshop } from '../../Interface/WorkshopInterface'

interface WorkshopCardProps {
  workshop: Workshop;
  selected: Workshop | undefined;
  setSelected: (workshop: Workshop) => void;
}

const WorkshopCard: FC<WorkshopCardProps> = ({ workshop, selected, setSelected }) => {
  return (
    <Flex
    w="180px"
    bg="gray.100"
    direction="column"
    borderRadius="12px"
    onClick={() => setSelected(workshop)}
    border={(!!selected && selected.id === workshop.id) ? "2.5px solid" : "none"}
    borderColor={"blue.500"}
    >
      <Image src={WorkshopImg} borderTopLeftRadius="12px" borderTopRightRadius="12px" />
      <Box p={"0.5rem"}>
        <Text align="left" noOfLines={2} fontWeight="600">
          {workshop.name}
        </Text>
        <Text align="left" fontWeight="700">
          {workshop.manager}
        </Text>
        <Flex align="flex-end" justify="space-between" marginTop="1rem">
          {/* <Box>
            <Text align="left">
              {workshop.date}
            </Text>
            <Text align="left">
              {workshop.time}
            </Text>
          </Box> */}
          <Box bg="white" w="fit-content" h="fit-content" p="0.2rem 0.4rem" borderRadius="99px">
            <Text fontWeight="600">
              {workshop.category}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default WorkshopCard