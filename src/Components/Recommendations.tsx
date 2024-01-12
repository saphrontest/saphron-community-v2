import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle, Stack, Text, useToast } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { getCommunities, getJoinedCommunitiesList, getUserCommunities, joinCommunity, leaveCommunity } from '../Helpers/apiFunctions';
import { setCommunities, setJoinedCommunities } from '../redux/slices/communitySlice';
import { Community, JoinedCommunity } from '../Interface/CommunityInterface';
import { getPexelPhoto } from '../pexelsClient';

interface RecommendationsProps {
  type?: string;
}

const Recommendations: FC<RecommendationsProps> = ({type = 'home'}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [viewAll, setViewAll] = useState(false)
    const [pexelThumbnail, setPexelThumbnail] = useState<any>()
    const [myCommmunities, setMyCommmunities] = useState<any[]>([])
    const {communities, joinedCommunities} = useSelector((state: RootState) => state.community)
    const user = useSelector((state: RootState) => state.user)

  const getThumbnail = async () => {
    const photo = await getPexelPhoto()
    setPexelThumbnail(photo)
  }

  useEffect(() => {
      getThumbnail()
  }, [])
    
    useEffect(() => {
      if(user.id) {
        getUserCommunity(user.id)
        getJoinedCommunities(user.id)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
    
    useEffect(() => {
      setLoading(true)
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
      }).finally(() => setLoading(false))
    }, [])

    const getJoinedCommunities = async (userId: string) => {
      const joined : JoinedCommunity[] | false = await getJoinedCommunitiesList(userId)
      joined && dispatch(setJoinedCommunities(joined as JoinedCommunity[]))
    }

    const getUserCommunity = async (userId: string) => {
        const comms = await getUserCommunities(userId)
        setMyCommmunities(comms)
    }
    
    const onJoin = async (userId: string, communityId: string) => {
      const mine = myCommmunities.find(mine => mine.communityId === communityId)
      if(!!mine){
        if(mine.isModerator) {
          return
        }
        const res = await leaveCommunity(userId, communityId)
        res && getJoinedCommunitiesList(userId)
        return;
      }
      const res = await joinCommunity(userId, communityId)
      res && getJoinedCommunitiesList(userId)
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
        bgImage={pexelThumbnail?.src?.original}
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
                      <Flex align="center" width="80%" gap={2} cursor="pointer" onClick={() => navigate(`/community-detail/${item.id}`)}>
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
                      <Button
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
                            .finally(() => {
                              getUserCommunity(user.id)
                              getJoinedCommunities(user.id)
                            })
                        }}
                        variant={!!joinedCommunities.find((joined: JoinedCommunity) => joined.communityId === item.id) ? "outline" : "solid"}
                      >
                        {joinedCommunities.find((joined: JoinedCommunity) => joined.communityId === item.id) ? "Joined" : "Join"}
                      </Button>
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
