import { FC, Fragment, useEffect, useState } from 'react'
import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import { Workshop } from '../../Interface/WorkshopInterface'
import communitiesBackground from '../../assets/images/communities.jpg'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { createSlug } from '../../Helpers'

const WorkshopItem: FC<{workshop: Workshop}> = ({workshop}) => {
    return (
        <Link to={`/workshops/${createSlug(workshop.workshop_name)}`}>
            <Flex pl="0.3rem" direction="row" textAlign="left" w="100%" align="center" justify="space-between">
                <Box>
                    <Text>{workshop.workshop_name}</Text>
                    <Text fontWeight={600}>{moment(new Date(workshop.date)).format("DD.MM.YYYY hh:mm")}</Text>
                </Box>
            </Flex>
        </Link>
    )
}

const JoinedWorkshops: FC<{
    joinWorkshops: Workshop[]
}> = ({ joinWorkshops }) => {

    const [pastWorkshops, setPastWorkshops] = useState<Workshop[]>([])
    const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([])

    useEffect(() => {
        
        joinWorkshops.forEach(workshop => {

            const workshop_date = moment(new Date(workshop?.date))
            const current_date = moment()

            if (workshop_date.isBefore(current_date)) {
                !pastWorkshops.some(w => w.id === workshop.id) && setPastWorkshops((prev) => ([...prev, workshop]))
            }

            if (workshop_date.isAfter(current_date)) {
                !upcomingWorkshops.some(w => w.id === workshop.id) && setUpcomingWorkshops((prev) => ([...prev, workshop]))
            }

        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [joinWorkshops])

    return (
        <Flex bg="white" direction="column">
            <Flex
                align="flex-end"
                color="white"
                bg="blue.500"
                height="120px"
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
                    Joined Workshops
                </Flex>
            </Flex>
            <Flex p="6px 10px" direction="column">
                {!!upcomingWorkshops?.length && <Text p="0.5rem 0" textAlign="left" fontWeight={600}>Upcoming</Text>}
                <Flex direction="column" gap="0.4rem">
                    {upcomingWorkshops?.map((workshop, idx) => (
                        <Fragment key={idx}>
                            <WorkshopItem workshop={workshop}/>
                            {upcomingWorkshops.length - 1 !== idx && <Divider />}
                        </Fragment>
                    ))}
                </Flex>
                {!!pastWorkshops?.length && <Text p="0.5rem 0" textAlign="left" fontWeight={600}>Past</Text>}
                <Flex direction="column" gap="0.4rem">
                    {pastWorkshops?.map((workshop, idx) => (
                        <Fragment key={idx}>
                            <WorkshopItem workshop={workshop}/>
                            {pastWorkshops.length - 1 !== idx && <Divider />}
                        </Fragment>
                    ))}
                </Flex>

            </Flex>
        </Flex>
    )
}

export default JoinedWorkshops
