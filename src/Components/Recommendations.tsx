import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../redux/store';
import { getCommunities, getUserCommunities } from '../Helpers/apiFunctions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseClient';
import CommArt from "../assets/images/CommsArt.png"
import { setCommunities } from '../redux/slices/communitySlice';
import { Community } from '../Interface/CommunityInterface';
import RecCommArt from '../assets/images/CommsArt.png'

const Recommendations = () => {
  const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [viewAll, setViewAll] = useState(false)
    const [myCommmunities, setMyCommmunities] = useState<any[]>([])
    const {communities} = useSelector((state: RootState) => state.community)
    const [user] = useAuthState(auth)
    
    useEffect(() => {
        user?.uid && getUserCommunity(user?.uid)
    }, [user])
    
    useEffect(() => {
      getCommunities().then(communitiesData => {
        const communityList = [
          ...communitiesData.map(({ id, name, creatorId, privacyType, createdAt }) => ({
            id,
            name,
            creatorId,
            privacyType,
            createdAt: {
              seconds: createdAt?.seconds,
              nanoseconds: createdAt?.nanoseconds 
            } 
          }))
        ]
        dispatch(setCommunities(communityList as Community[]))
      })
    }, [])

    const getUserCommunity = async (userId: string) => {
        const comms = await getUserCommunities(userId)
        setMyCommmunities(comms)
    }
    const onJoin = () => {

    }

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        backgroundSize="cover"
        bgImage={RecCommArt}
      >
        <Flex
        width="100%"
        height="100%"
        align="flex-end"
        color="white"
        p="6px 10px"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
        >
          Top Communities
        </Flex>
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {(viewAll ? communities : communities.slice(0, 3)).map((item: Community, index: number) => {
              return (
                <Link key={item.id} to={`/community/${item.id}`}>
                  <Flex
                    position="relative"
                    align="center"
                    fontSize="10pt"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    p="10px 12px"
                    fontWeight={600}
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text mr={2}>{index + 1}</Text>
                      </Flex>
                      <Flex align="center" width="80%" gap={2}>
                      <Avatar src={item.imageURL} boxSize={item.imageURL ? 28 : 30} style={{width: 30, height: 30}} />
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >{`comm/${item.name}`}</span>
                      </Flex>
                    </Flex>
                    <Box position="absolute" right="10px">
                      {/* <Button
                        height="22px"
                        fontSize="8pt"
                        onClick={(event) => {
                          event.stopPropagation();
                          onJoin()
                        }}
                        variant={isJoined ? "outline" : "solid"}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button> */}
                    </Box>
                  </Flex>
                </Link>
              );
            })}
              {communities.length > 4 && 
                <Box p="10px 20px">
                    <Button height="30px" width="100%" onClick={() => setViewAll(prev => !prev)}>
                      {viewAll ? "Hide" : "View All"}
                    </Button>
                </Box>
              }
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Recommendations
