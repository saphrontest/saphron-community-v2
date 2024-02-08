import { FC, Fragment } from 'react'
import { Flex } from '@chakra-ui/react'
import { WorkshopCard } from '../Components'
import { Workshop } from '../Interface/WorkshopInterface'

interface WorkshopListProps {
    workshops: Workshop[];
    selected: Workshop | undefined;
    setSelected: (workshop: Workshop) => void
}

const Mobile: FC<{ workshops: Workshop[] }> = ({ workshops }) => {

    return (
        <Flex direction="column" gap="1rem">
            {workshops.map((workshop, idx) => (
                <Fragment key={idx}>
                    <WorkshopCard.Mobile workshop={workshop} idx={idx}/>
                </Fragment>
            ))}
        </Flex>)
}

const Desktop: FC<WorkshopListProps> = ({ workshops, selected, setSelected }) => {
    return (
        <Flex direction="row" align="flex-start" gap="1rem" w="50%" h="fit-content" flexWrap="wrap">
            {
                workshops
                    .map((workshop: Workshop, idx: number) => (
                        <WorkshopCard.Desktop key={idx} workshop={workshop} selected={selected} setSelected={setSelected} />
                    ))
            }
        </Flex>
    )
}



// eslint-disable-next-line import/no-anonymous-default-export
export default { Desktop, Mobile }