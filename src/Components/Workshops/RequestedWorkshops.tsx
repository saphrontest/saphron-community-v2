import { FC, Fragment } from 'react'
import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import { Workshop } from '../../Interface/WorkshopInterface'
import communitiesBackground from '../../assets/images/communities.jpg'
import moment from 'moment'

const WorkshopItem: FC<{ workshop: Workshop }> = ({ workshop }) => {
    return (
        <Flex direction="row" textAlign="left" w="100%" align="center" justify="space-between">
            <Box>
                <Text>{workshop.workshop_name}</Text>
                <Text fontWeight={600}>{moment(new Date(workshop.date)).format("DD.MM.YYYY hh:mm")}</Text>
            </Box>
            <Box bg={workshop.isVerified ? "green.300" : "gray"} h="fit-content" p="0.2rem 0.6rem" borderRadius={999}>
                <Text color="white" fontWeight={600}>{workshop.isVerified ? "verified" : "waiting"}</Text>
            </Box>
        </Flex>
    )
}

const RequestedWorkshops: FC<{
    newWorkshopRequests: Workshop[];
    joinRequests: Workshop[]
}> = ({ newWorkshopRequests, joinRequests }) => {

    return (
        <Flex bg="white" w="35%" direction="column">
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
                    Requested Workshops
                </Flex>
            </Flex>
            <Flex p="6px 10px" direction="column">
                {!!newWorkshopRequests.length && <Text fontWeight={700} align="left" pb="0.4rem">New Workshop Requests</Text>}
                {newWorkshopRequests.map((workshop, idx) => (
                    <Fragment key={workshop.id}>
                        <WorkshopItem workshop={workshop}/>
                        {newWorkshopRequests.length - 1 !== idx && <Divider />}
                    </Fragment>
                ))}
                {!!joinRequests.length && <Text fontWeight={700} align="left" paddingTop="1rem" paddingBottom="0.4rem">Join Requests</Text>}
                {joinRequests.map((workshop, idx) => (
                    <Fragment key={workshop.id}>
                        <WorkshopItem workshop={workshop}/>
                        {joinRequests.length - 1 !== idx && <Divider />}
                    </Fragment>
                ))}
            </Flex>
        </Flex>
    )
}

export default RequestedWorkshops