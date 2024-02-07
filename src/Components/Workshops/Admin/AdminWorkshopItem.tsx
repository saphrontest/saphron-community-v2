import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import moment from 'moment'
import AdminStatusSelect from './AdminStatusSelect'
import { FC } from 'react'
import { Workshop, WorkshopStatusSelectOptionInterface } from '../../../Interface/WorkshopInterface'

const AdminWorkshopItem: FC<{
  idx: number;
  workshop: Workshop;
  selectOptions: WorkshopStatusSelectOptionInterface[];
  onSelect: (worksopId: string, optionId: number) => Promise<Boolean>
}> = ({workshop, idx, onSelect, selectOptions}) => {
  return (
      <Flex direction="row" justify="space-between" align="center" p="1rem" bg="gray.50" borderRadius="1rem">
        <Flex direction="row" align="center" h="100%" gap="1rem" w="100%">
          <Flex align="center" h="100%" w="40%">
            <Text fontWeight={600} mr="1rem">#{idx + 1}</Text>
            <Image src={workshop.cover_img} w="7rem" h="5rem" mr="1rem" borderRadius="1rem" />
            <Box>
              <Text textAlign="left" fontWeight="600" fontSize="18" noOfLines={2}>{workshop.workshop_name}</Text>
              <Text textAlign="left">{moment(new Date(workshop.createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
            </Box>
          </Flex>
          <Divider orientation='vertical' borderColor="gray" h="100%"/>
          <Flex direction="row" gap="0.5rem"> 
              <Image src={workshop.workshop_manager_avatar} width="32px" height="32px" borderRadius={999} />
              <Flex gap="0.3rem" align="flex-start" justify="center" direction="column">
                <Text textAlign="left" color="gray" fontSize={12} fontStyle="italic">#{workshop.workshop_manager_id}</Text>
                <Text textAlign="left">{workshop.workshop_manager_name}</Text>
                <Text textAlign="left">{workshop.workshop_manager_mail}</Text>
              </Flex>
          </Flex>
        </Flex>
        <Box>
          <AdminStatusSelect onSelect={onSelect} workshop={workshop} selectOptions={selectOptions} />
        </Box>
      </Flex>
  )
}

export default AdminWorkshopItem