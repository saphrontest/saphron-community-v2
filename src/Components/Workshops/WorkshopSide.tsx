import { Flex, Text, Divider } from '@chakra-ui/react'
import communitiesBackground from '../../assets/images/communities.jpg'
import { Link } from 'react-router-dom'
import { FC, Fragment, useEffect, useState } from 'react'
import { createSlug, getWorkshops } from '../../Helpers'
import { Workshop } from '../../Interface/WorkshopInterface'

const WorkshopSide: FC<{
  showButton?: boolean
}> = ({showButton = true}) => {

  const [workshops, setWorkshops] = useState<Workshop[]>()

  useEffect(() => {
    getWorkshops()
    .then(result => result && setWorkshops(result))
  }, [])

  return (
    <Flex
      p={1}
      w="100%"
      h="fit-content"
      bg="white"
      flexDirection="column"
      display={{ base: "none", sm: "none", md: "flex" }}
    >
      <Flex
        align="flex-end"
        color="white"
        bg="blue.500"
        height="100px"
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
          Workshops
        </Flex>
      </Flex>
      <Flex direction="column">
        {workshops?.map((w, idx) => (
          <Fragment key={w.id}>
            <Link to={`/workshops/${createSlug(w.workshop_name)}`}>
              <Text  textAlign="left" fontSize={14} fontWeight={500} padding="6px 4px">
                {w.workshop_name}
              </Text>
            </Link>
            {idx !== workshops?.length-1 && <Divider/>}
          </Fragment>
        ))}
        {showButton && (
          <>
            <Divider />
            <Link to={'/workshops'}>
              <Text textAlign="right" fontSize={14} fontWeight={600} padding="6px 4px">
                Show All Workshops
              </Text>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default WorkshopSide