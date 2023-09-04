import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useOutsideClick } from '@chakra-ui/react';
import { FC, useEffect, useRef } from 'react'
import { GrAdd } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../redux/slices/modalSlice';
import { getCommunities } from '../../../Helpers/apiFunctions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseClient';
import { useNavigate } from 'react-router-dom';
import { setCommunities, setSelectedCommunity } from '../../../redux/slices/communitySlice';
import { RootState } from '../../../redux/store';
import { Community } from '../../../Interface/CommunityInterface';

interface CommunityProps {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    isNav?: boolean;
}

const CommunitySelect: FC<CommunityProps> = ({isOpen, setOpen, isNav}) => {
    const {communities} = useSelector((state: RootState) => state.community)
    const navigate = useNavigate()
    const communityMenuRef = useRef(null)
    const dispatch = useDispatch()
    const [user] = useAuthState(auth);
    const {selectedCommunity} = useSelector((state: RootState) => state.community)
    useOutsideClick({
        ref: communityMenuRef,
        handler: () => isOpen && setOpen(isOpen)
      });

    useEffect(() => {
        const get = async () => {
            const res = await getCommunities()
            const communityList = [...res.map(({ id, name, creatorId, privacyType, createdAt }) => ({ id, name, creatorId, privacyType, createdAt: { seconds: createdAt?.seconds, nanoseconds: createdAt?.nanoseconds } }))]
            dispatch(setCommunities(communityList as Community[]))
        }
        get()
    }, [])

    return (
        <Menu isOpen={isOpen}>
            <MenuButton
                width={"fit-content"}
                height={"32px"}
                background={"white"}
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                mr={2}
                onClick={() => setOpen(!isOpen)}
            >
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    width={{ base: "auto", lg: "200px" }}
                >
                    <Flex alignItems="center">
                        <>
                            <Box
                                display={{ base: "none", lg: "flex" }}
                                flexDirection="column"
                                fontSize="10pt"
                            >
                                <Text fontWeight={600}>{selectedCommunity?.name}</Text>
                            </Box>
                        </>
                    </Flex>
                    <ChevronDownIcon color="gray.500" />
                </Flex>
            </MenuButton>
            <MenuList ref={communityMenuRef}>
                <Box mt={3} mb={4}>
                    <Text
                        pl={3}
                        mb={1}
                        fontSize="7pt"
                        fontWeight={500}
                        color="gray.500"
                    >
                        MODERATING
                    </Text>
                    {communities.filter(comm => comm.creatorId === user?.uid).map(comm => {
                        return (
                            <MenuItem
                                key={comm.id}
                                width="100%"
                                fontSize="10pt"
                                fontWeight={600}
                                _hover={{ bg: "gray.100" }}
                                onClick={() => {
                                    dispatch(setSelectedCommunity(comm))
                                    !!isNav && navigate(`/community/${comm.id}`)
                                    setOpen(false)
                                }}
                            >
                                <Flex alignItems="center">{comm.name}</Flex>
                            </MenuItem>
                        )
                    })}
                    
                </Box>
                <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                MY COMMUNITIES
                </Text>
                {communities.filter(comm => comm.creatorId !== user?.uid).map(comm => {
                    return (
                        <MenuItem
                            key={comm.id}
                            width="100%"
                            fontSize="10pt"
                            fontWeight={600}
                            _hover={{ bg: "gray.100" }}
                            onClick={() => {
                                dispatch(setSelectedCommunity(comm))
                                !!isNav && navigate(`/community/${comm.id}`)
                                setOpen(false)
                            }}
                        >
                            <Flex alignItems="center">{comm.name}</Flex>
                        </MenuItem>
                    )
                })}
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
            </MenuList>
        </Menu>
    )
}

export default CommunitySelect