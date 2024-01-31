import { Flex } from '@chakra-ui/react'
import communitiesBackground from '../../assets/images/communities.jpg'

const JoinedWorkshops = () => {
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
            <Flex p="6px 10px">
                test
            </Flex>
        </Flex>
    )
}

export default JoinedWorkshops
