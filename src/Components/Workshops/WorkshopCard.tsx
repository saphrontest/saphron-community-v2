import { Box, Button, Divider, Flex, Image, Text, useBoolean } from '@chakra-ui/react'
import { FC } from 'react'
import { Workshop } from '../../Interface/WorkshopInterface'
import moment from 'moment';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { setModal } from '../../redux/slices/modalSlice';
import { useDispatch } from 'react-redux';


interface IMobileCard {
  workshop: Workshop;
  idx: number;
}

const Mobile: FC<IMobileCard> = ({
  workshop,
  idx
}) => {
  const dispatch = useDispatch()
  const [isClicked, { toggle: toggleClick }] = useBoolean(false)
  return (
    <Flex direction="column" w="100%" justify="space-between" align="flex-start" cursor="pointer" bg="gray.100" borderRadius="1rem" p="1rem" onClick={toggleClick}>
      <Flex direction="row" align="center">
        <Text fontWeight={600} mr="1rem">#{idx + 1}</Text>
        <Image src={workshop.cover_img} w="5rem" h="3rem" mr="1rem" borderRadius="0.2rem" />
        <Box>
          <Text textAlign="left" fontWeight="600" fontSize={["12", "18"]} noOfLines={2}>{workshop.workshop_name}</Text>
          <Text textAlign="left" fontSize={["12", "16"]}>{moment(new Date(workshop.createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
        </Box>
        {!isClicked ? <MdKeyboardArrowDown size={24} /> : <MdKeyboardArrowUp size={24} />}
      </Flex>
      {isClicked ? (
        <Flex direction="column" w="100%" align="flex-start" gap="1rem" p="1rem" onClick={ev => ev.stopPropagation()}>
          <Divider borderColor="gray" />
          <Box>
            <Text textAlign="left" fontStyle="italic" fontSize={["12", "16"]}>{workshop.short_description}</Text>
            <Text textAlign="left" fontSize={["12", "16"]} fontWeight="600" mt="1rem" dangerouslySetInnerHTML={{ __html: workshop.detailed_description }} />
          </Box>
          <Flex gap="1rem" w="100%" justify="flex-end">
            <Button onClick={(ev) => {
              ev.stopPropagation()
              dispatch(setModal({ isOpen: true, view: "joinWorkshop", data: workshop }))
            }}
              fontSize={["12", "16"]}
            >Join Workshop</Button>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  )
}

interface IDesktopCard {
  workshop: Workshop;
  selected?: Workshop | undefined;
  setSelected?: (workshop: Workshop) => void;
}

const Desktop: FC<IDesktopCard> = ({
  workshop,
  setSelected,
  selected
}) => {
  return (
    (
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
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { Desktop, Mobile }