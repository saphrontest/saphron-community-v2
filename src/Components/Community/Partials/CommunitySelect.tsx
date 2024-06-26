import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useOutsideClick } from '@chakra-ui/react';
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { GrAdd } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../redux/slices/modalSlice';
import { useNavigate } from 'react-router-dom';
import { setCommunities, setJoinedCommunities, setSelectedCommunity } from '../../../redux/slices/communitySlice';
import { RootState } from '../../../redux/store';
import { Community, IUser, JoinedCommunity } from '../../../Interface';
import NoEntry from '../../NoEntry';
import { useCommunity } from '../../../Hooks';
import CommunitySelectSegment from './CommunitySelectSegment';

interface CommunityProps {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    isNav?: boolean;
    selectedCommunityId?: string;
    showTitleOnMobile?: boolean;
}

const CommunitySelect: FC<CommunityProps> = ({
    isNav,
    isOpen,
    setOpen,
    selectedCommunityId,
    showTitleOnMobile = true
}) => {

    const communityMenuRef = useRef(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { getCommunities, getJoinedCommunities } = useCommunity()

    const [formattedCommunities, setFormattedCommunities] = useState<any[]>([])

    const user: IUser = useSelector((state: RootState) => state.user)
    const { communities, selectedCommunity, joinedCommunities } = useSelector((state: RootState) => state.community)

    useOutsideClick({
        ref: communityMenuRef,
        handler: () => isOpen && setOpen(!isOpen)
    });


    const getCommunityList = async () => {
        const res = await getCommunities()
        dispatch(setCommunities(res as Community[]))
    }

    const getJoinedCommunitiesList = async (userId: string) => {
        const joined = await getJoinedCommunities(userId)
        joined && dispatch(setJoinedCommunities(joined))
    }

    useEffect(() => {
        user?.id && getJoinedCommunitiesList(user?.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        getCommunityList()
        if (selectedCommunityId) {
            const comm = communities.find(
                (community: Community) => community.id === selectedCommunityId
            )
            comm && dispatch(setSelectedCommunity(comm))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = (comm: any) => {
        dispatch(setSelectedCommunity(comm))
        !!isNav && navigate(`/community/community-detail/${comm.id}`)
        setOpen(false)
    }

    useEffect(() => {
        if (joinedCommunities.length && communities.length) {
            setFormattedCommunities([])

            joinedCommunities.forEach((joined: JoinedCommunity) => {
                communities.forEach((community: Community) => {
                    if (joined.communityId === community.id) {
                        setFormattedCommunities(prev => ([{ isModerator: joined?.isModerator, ...community }, ...prev]))
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
                        display={{ base: !showTitleOnMobile ? "none" : "flex", lg: "flex" }}
                        flexDirection="column"
                        fontSize="10pt"
                    >{selectedCommunity?.name ?? "Select Community"}</Text>
                    <ChevronDownIcon color="gray.500" />
                </Flex>
            </MenuButton>
            <MenuList ref={communityMenuRef} zIndex={9999}>
                {
                    !!formattedCommunities.length === false ? <NoEntry type="community" /> : (
                        <>
                            <Box mt={3} mb={4}>
                                <CommunitySelectSegment
                                    communities={formattedCommunities.filter(com => com.isModerator)}
                                    onItemClick={(comm: any) => handleClick(comm)}
                                    title='MODERATING'
                                />
                            </Box>
                            <Box mt={3} mb={4}>
                                <CommunitySelectSegment
                                    communities={formattedCommunities.filter(com => !com.isModerator)}
                                    onItemClick={(comm: any) => handleClick(comm)}
                                    title='MY COMMUNITIES'
                                />
                                <MenuDivider />
                                <MenuItem
                                    width="100%"
                                    fontSize="10pt"
                                    _hover={{ bg: "gray.100" }}
                                    onClick={() => dispatch(setModal({ isOpen: true, view: "addCommunity" }))}
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