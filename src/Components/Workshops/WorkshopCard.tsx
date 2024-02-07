import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Workshop } from '../../Interface/WorkshopInterface'

interface WorkshopCardProps {
  workshop: Workshop;
  selected?: Workshop | undefined;
  setSelected?: (workshop: Workshop) => void;
}

const WorkshopCard: FC<WorkshopCardProps> = ({ workshop, selected, setSelected }) => {
  return (
    <Flex
    w="180px"
    minH="250px"
    bg="gray.100"
    cursor="pointer"
    direction="column"
    borderRadius="12px"
    onClick={() => setSelected && setSelected(workshop)}
    border={(!!selected && selected.id === workshop.id) ? "2.5px solid" : "none"}
    borderColor="blue.500"
    >
      <Image src={workshop.cover_img} borderTopLeftRadius="12px" borderTopRightRadius="12px" />
      <Flex direction="column" justify="space-between" flex="1" p={"0.5rem"}>
        <Box>
          <Text align="left" noOfLines={2} fontWeight="600">
            {workshop.workshop_name}
          </Text>
          <Text align="left" fontWeight="700">
            {workshop.workshop_manager_name}
          </Text>
        </Box>
          <Box bg="white" w="fit-content" h="fit-content" p="0.2rem 0.4rem" borderRadius="99px">
            <Text fontWeight="600">
              {workshop.category}
            </Text>
          </Box>
      </Flex>
    </Flex>
  )
}

export default WorkshopCard