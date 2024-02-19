import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useOutsideClick } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react'
import { GrAdd } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../redux/slices/modalSlice';
import { getCommunities, getJoinedCommunitiesList } from '../../../Helpers/apiFunctions';
import { useNavigate } from 'react-router-dom';
import { setCommunities, setJoinedCommunities, setSelectedCommunity } from '../../../redux/slices/communitySlice';
import { RootState } from '../../../redux/store';
import { Community, JoinedCommunity } from '../../../Interface';
import NoEntry from '../../NoEntry';

interface CommunityProps {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    isNav?: boolean;
    selectedCommunityId?: string;
}

const CommunitySelect: FC<CommunityProps> = ({isOpen, setOpen, isNav, selectedCommunityId}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const communityMenuRef = useRef(null)
    const [formattedCommunities, setFormattedCommunities] = useState<any[]>([])
    const {communities, selectedCommunity, joinedCommunities} = useSelector((state: RootState) => state.community)
    
    useOutsideClick({
        ref: communityMenuRef,
        handler: () => isOpen && setOpen(!isOpen)
      });

    const getCommunityList = async () => {
        const res = await getCommunities()
        const communityList = [
            ...res.map(({ id, name, creatorId, privacyType, createdAt }) => ({
                 id,
                 name,
                 creatorId,
                 privacyType,
                 createdAt: { seconds: createdAt?.seconds, nanoseconds: createdAt?.nanoseconds }
                }))
            ]
        dispatch(setCommunities(communityList as Community[]))
    }
    const getJoinedCommunities = async (userId: string) => {
        const joined = await getJoinedCommunitiesList(userId)
        joined && dispatch(setJoinedCommunities(joined))
    }

    useEffect(() => {
        user?.id && getJoinedCommunities(user?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {    
        getCommunityList()
        if(selectedCommunityId){
            const comm = communities.find((community: Community) => community.id === selectedCommunityId)
            comm && dispatch(setSelectedCommunity(comm))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if(joinedCommunities.length && communities.length) {
            setFormattedCommunities([])

            joinedCommunities.forEach((joined: JoinedCommunity) => {
                communities.forEach((community: Community) => {
                    if(joined.communityId === community.id) {
                        setFormattedCommunities(prev => ([{isModerator: joined?.isModerator, ...community}, ...prev])) 
                    }
                    
                });
            })

        }
    }, [communities, joinedCommunities])

    


    return (
        <Menu isOpen={isOpen}>
            <MenuButton
                width={"fit-content"}
                minH="34px"
                minW="34px"
                background={"white"}
                cursor="pointer"
                padding="0px 6px"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="4px"
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                onClick={() => setOpen(!isOpen)}
                mr={2}
            >
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    width={{ base: "auto", lg: "200px" }}
                >
                    <Text
                    fontWeight={600}
                    display={{ base: "none", lg: "flex" }}
                    flexDirection="column"
                    fontSize="10pt"
                    >{selectedCommunity?.name ?? "Select Community"}</Text>
                    <ChevronDownIcon color="gray.500" />
                </Flex>
            </MenuButton>
            <MenuList ref={communityMenuRef} zIndex={9999}>
                {
                    !!formattedCommunities.length === false ? <NoEntry type="community"/> : (
                        <>
                        
                <Box mt={3} mb={4}>
                    {!!formattedCommunities.filter(com => com.isModerator).length ? <Text
                        pl={3}
                        mb={1}
                        fontSize="7pt"
                        fontWeight={500}
                        color="gray.500"
                    >
                        MODERATING
                    </Text> : null}
                    {formattedCommunities.filter(com => com.isModerator).map(comm => {
                        return (
                            <MenuItem
                                key={comm.id}
                                width="100%"
                                fontSize="10pt"
                                fontWeight={600}
                                _hover={{ bg: "gray.100" }}
                                onClick={() => {
                                    dispatch(setSelectedCommunity(comm))
                                    !!isNav && navigate(`/community/community-detail/${comm.id}`)
                                    setOpen(false)
                                }}
                            >
                                <Flex alignItems="center">{comm.name}</Flex>
                            </MenuItem>
                        )
                    })}
                    
                </Box>
                <Box mt={3} mb={4}>
                {!!formattedCommunities.filter(com => !com.isModerator).length && <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                MY COMMUNITIES
                </Text>}
                {formattedCommunities.filter(com => !com.isModerator).map(comm => {
                    return (
                        <MenuItem
                            key={comm.id}
                            width="100%"
                            fontSize="10pt"
                            fontWeight={600}
                            _hover={{ bg: "gray.100" }}
                            onClick={() => {
                                dispatch(setSelectedCommunity(comm))
                                !!isNav && navigate(`/community/community-detail/${comm.id}`)
                                setOpen(false)
                            }}
                        >
                            <Flex alignItems="center">{comm.name}</Flex>
                        </MenuItem>
                    )
                })}
                <MenuDivider />
                <MenuItem
                width="100%"
                fontSize="10pt"
                _hover={{ bg: "gray.100" }}
                onClick={() => dispatch(setModal({isOpen: true, view: "addCommunity"}))}
                >
                <Flex alignItems="center">
                    <Icon fontSize={20} mr={2} as={GrAdd} />
                    Create Community
                </Flex>
                </MenuItem>
            </Box>

            </>
                    )}
            </MenuList>
        </Menu>
    )
}

export default CommunitySelect