import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle, Stack, Text, useToast } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setCommunities, setJoinedCommunities } from '../redux/slices/communitySlice';
import { Community, IUser, JoinedCommunity } from '../Interface';
import communitiesBackground from '../assets/images/communities.jpg'
import { useCommunity, useReward } from '../Hooks';

interface RecommendationsProps {
  type?: string;
}

const Recommendations: FC<RecommendationsProps> = ({type = 'home'}) => {
  
  const toast = useToast()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {winRewardBySlug} = useReward()
  const {getCommunities, getJoinedCommunities, joinCommunity, leaveCommunity, getCommunitiesByUserId} = useCommunity()
  
  const [loading, setLoading] = useState(false)
  const [viewAll, setViewAll] = useState(false)
  const [myCommmunities, setMyCommmunities] = useState<any[]>([])
  
  const user: IUser = useSelector((state: RootState) => state.user)
  const {communities, joinedCommunities} = useSelector((state: RootState) => state.community)
  
  useEffect(() => {
    !!user.id && get(user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const get = async (userId: string) => {
    await getUserCommunity(userId)
    await getJoinedCommunitiesList(userId)
  }
  
  useEffect(() => {
    if(type === "home") {
      setLoading(true)
      getAllCommunities()
        .finally(() => setLoading(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllCommunities = async () => {
    getCommunities()
    .then(communitiesData => communitiesData && dispatch(setCommunities(communitiesData)))
  }

  const getJoinedCommunitiesList = async (userId: string) => {
    const joined = await getJoinedCommunities(userId)
    !!joined && dispatch(setJoinedCommunities(joined))
  }

  const getUserCommunity = async (userId: string) => {
      const comms = await getCommunitiesByUserId(userId)
      comms && setMyCommmunities(comms)
  }
  
  const onJoin = async (userId: string, communityId: string) => {
    const mine = myCommmunities.find(mine => mine.communityId === communityId)
    if(!!mine){
      if(mine.isModerator) {
        return
      }
      await leaveCommunity(userId, communityId)
      await getJoinedCommunitiesList(userId)
      return;
    }
    await joinCommunity(userId, communityId)
    await winRewardBySlug('join_community', userId)
    await getJoinedCommunitiesList(userId)
  }


  return !!communities.filter((c: Community) => {
    if (type === "home") {
      return true;
    }
    return joinedCommunities.some((joined : JoinedCommunity) => joined.communityId === c.id)
  }).length ? (
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
          {type === "home" ? "Top Communities" : "My Communities"}
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
            {(viewAll ? communities : communities.slice(0, 3))
              .filter((c: Community) => {
                if (type === "home") {
                  return true;
                }
                return joinedCommunities.some((joined : JoinedCommunity) => joined.communityId === c.id)
              })
              .map((item: Community, index: number) => {
              return (
                // <Link key={item.id} to={`/community/${item.id}`}>
                <Box key={item.id} >
                  <Flex
                    position="relative"
                    align="center"
                    fontSize="10pt"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    p="10px 12px"
                    fontWeight={600}
                    cursor={"default"}
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text mr={2}>{index + 1}</Text>
                      </Flex>
                      <Flex align="center" width="80%" gap={2} cursor="pointer" onClick={() => navigate(`/community/community-detail/${item.id}`)}>
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
                      {user.id && <Button
                        height="22px"
                        fontSize="8pt"
                        onClick={(event) => {
                          event.stopPropagation();
                          if(!user.id) {
                            toast({
                              title: "Please login, first!",
                              status: "error",
                              isClosable: true,
                              position: "top-right"
                            })
                            return;
                          }
                          onJoin(user?.id, item.id)
                            .then(async () => {
                              await getUserCommunity(user.id)
                              await getJoinedCommunitiesList(user.id)
                            })
                        }}
                        variant={!!joinedCommunities.find((joined: JoinedCommunity) => joined.communityId === item.id) ? "outline" : "solid"}
                      >
                        {joinedCommunities.find((joined: JoinedCommunity) => joined.communityId === item.id) ? "Joined" : "Join"}
                      </Button>}
                    </Box>
                  </Flex>
                </Box>
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
  ) : null
}

export default Recommendations
