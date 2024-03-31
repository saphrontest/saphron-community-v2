import { Avatar, Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { Community, JoinedCommunity } from '../Interface';
import communitiesBackground from '../assets/images/communities.jpg'
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinedCommunities } from '../redux/slices/communitySlice';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '../Hooks';

const MyCommunities = () => {
    const toast = useToast()
    const {getJoinedCommunities, leaveCommunity} = useCommunity()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user)
    const {communities, joinedCommunities} = useSelector((state: RootState) => state.community)

    const onLeave = async (userId: string, communityId: string) => {
        await leaveCommunity(userId, communityId)
        await getJoinedCommunitiesList(userId)
    }

    const getJoinedCommunitiesList = async (userId: string) => {
        const joined = await getJoinedCommunities(userId)
        !!joined && dispatch(setJoinedCommunities(joined))
    }

    return (
      <Flex bg="white" p={1} direction="column">
        <Box
        w="100%"
        h="130px"
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
            My Communities
          </Flex>
        </Box>
        <Flex direction="column">
          {
            communities.filter((c: Community) => {
              return joinedCommunities.some((joined : JoinedCommunity) => joined.communityId === c.id)
            })
            .map((item: Community, index: number) => (
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
                      <Flex align="center" width="70%" gap={2} cursor="pointer" onClick={() => navigate(`/community/community-detail/${item.id}`)}>
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
                          onLeave(user?.id, item.id)
                            .then(async () => {
                              await getJoinedCommunitiesList(user.id)
                            })
                        }}
                        variant="outline"
                      >
                        Leave
                      </Button>
                    </Box>
                  </Flex>
                </Box>
            ))
          }
        </Flex>
      </Flex>
    )
  }

export default MyCommunities