import { Box, Button, Divider, Flex, Image, Text, useBoolean } from '@chakra-ui/react'
import { FC } from 'react';
import { ISupportGroup } from '../../Interface';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { setModal } from '../../redux/slices/modalSlice';
import { Link } from 'react-router-dom';
import { createSlug } from '../../Helpers';

interface ISupportGroupItem {
    onClick?: () => void;
    item: ISupportGroup;
    selected?: ISupportGroup;
    idx?: number;
}

const Mobile: FC<ISupportGroupItem> = ({item, idx}) => {
    const dispatch = useDispatch()
    const [isClicked, { toggle: toggleClick }] = useBoolean(false)
    return (
        <Flex direction="column" w="100%" justify="space-between" align="flex-start" cursor="pointer" bg="gray.100" borderRadius="1rem" p="1rem" onClick={toggleClick}>
            <Flex direction="row" align="center" justify="space-between" w="100%">
                <Flex align="center">
                    <Text fontWeight={600} mr="1rem">#{idx ? idx + 1 : 1}</Text>
                    <Image src={item.cover_img} w="5rem" h="3rem" mr="1rem" borderRadius="0.2rem" />
                    <Box>
                        <Text textAlign="left" fontWeight="600" fontSize={["12", "18"]} noOfLines={2}>{item.support_group_name}</Text>
                        <Text textAlign="left" fontSize={["12", "16"]}>{moment(new Date(item.createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
                    </Box>
                </Flex>
                {!isClicked ? <MdKeyboardArrowDown size={24} /> : <MdKeyboardArrowUp size={24} />}
            </Flex>
            {isClicked ? (
                <Flex direction="column" w="100%" align="flex-start" gap="1rem" p="1rem" onClick={ev => ev.stopPropagation()}>
                    <Divider borderColor="gray" />
                    <Box>
                        <Text textAlign="left" fontSize={["12", "16"]} dangerouslySetInnerHTML={{__html: item.description}}/>
                        <Link to={`${createSlug(item.support_group_name)}`}>
                            <Text fontWeight="600" align="left" mt="1rem">
                                Show More...
                            </Text>
                        </Link>
                    </Box>
                    <Flex gap="1rem" w="100%" justify="flex-end">
                        <Button
                        onClick={(ev) => {
                            ev.stopPropagation()
                            dispatch(setModal({ isOpen: true, view: "joinSupportGroup", data: item }))
                        }}
                        fontSize={["12", "16"]}
                        >Join Support Group</Button>
                    </Flex>
                </Flex>
            ) : null}
        </Flex>
    )
}

const Desktop: FC<ISupportGroupItem> = ({ onClick, item, selected }) => {
    return (
        <Flex
            w="180px"
            minH="150px"
            h="240px"
            bg="gray.100"
            cursor="pointer"
            onClick={onClick}
            direction="column"
            borderRadius="12px"
            outline={item === selected ? "2.5px solid" : "none"}
            outlineColor={item === selected ? "blue.500" : "transparent"}
        >
            <Image src={item.cover_img} borderTopLeftRadius="12px" borderTopRightRadius="12px" h="150px" />
            <Flex flex="1" p="0.5rem" direction="column" justify="space-between">
                <Box>
                    <Text align="left" noOfLines={2} fontWeight="600" textTransform="capitalize">
                        {item.support_group_name}
                    </Text>
                    <Text align="left" fontWeight="700">
                        {item.support_group_manager_name}
                    </Text>
                </Box>
            </Flex>
        </Flex>
    )
}

const SupportGroupItem = { Mobile, Desktop }

export default SupportGroupItem