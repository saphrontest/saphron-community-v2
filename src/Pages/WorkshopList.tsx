import { Flex } from '@chakra-ui/react'
import React, { FC } from 'react'
import { WorkshopCard } from '../Components'
import { Workshop } from '../Interface/WorkshopInterface'

const WorkshopList: FC<{ workshops: Workshop[]; selected: Workshop | undefined; setSelected: (workshop: Workshop) => void }> = ({ workshops, selected, setSelected }) => {
    return (
        <Flex direction="row" align="flex-start" gap="1rem" w="50%" flexWrap="wrap">
            {workshops.map((workshop: Workshop, idx: number) => <WorkshopCard key={idx} workshop={workshop} selected={selected} setSelected={setSelected} />)}
        </Flex>
    )
}

export default WorkshopList