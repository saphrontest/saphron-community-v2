import { FC, Fragment } from 'react'
import { Flex, useMediaQuery } from '@chakra-ui/react'
import { NoEntry, WorkshopCard } from '..'
import { Workshop } from '../../Interface'

interface WorkshopListProps {
    workshops: Workshop[];
    selected?: Workshop;
    setSelected?: (workshop: Workshop) => void
}

const Mobile: FC<WorkshopListProps> = ({ workshops}) => {
    return (
        <Flex direction="column" gap="1rem" w="100%">
            {
                workshops.length ? workshops.map((workshop, idx) => (
                    <Fragment key={idx}>
                        <WorkshopCard.Mobile workshop={workshop} idx={idx} />
                    </Fragment>
                )) : <NoEntry type="workshop"/>
            }
        </Flex>
    )
}

const Desktop: FC<WorkshopListProps> = ({ workshops, selected, setSelected }) => {
    return (
        <Flex direction="row" align="flex-start" gap="1rem" w="50%" h="fit-content" flexWrap="wrap">
            {
                workshops
                    .map((workshop: Workshop, idx: number) => (
                        <WorkshopCard.Desktop
                        key={idx}
                        workshop={workshop}
                        isActive={selected?.id === workshop.id}
                        setSelected={setSelected}
                        />
                    ))
            }
        </Flex>
    )
}

const WorkshopList:FC<WorkshopListProps> = ({ workshops, selected, setSelected }) => {
    const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
    return isSmallerThan766 ? <Mobile workshops={workshops} /> : <Desktop selected={selected} setSelected={setSelected} workshops={workshops} />
}

export default WorkshopList