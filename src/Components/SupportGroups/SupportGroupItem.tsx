import { Box, Flex, Image, Text } from '@chakra-ui/react'
import comm from '../../assets/images/menthal.jpg'
import { FC } from 'react';
import { ISupportGroup } from '../../Interface/SupportGroupInterface';

interface ISupportGroupItem {
    onClick?: () => void;
    item: ISupportGroup;
    selected: ISupportGroup;
}

const SupportGroupItem:FC<ISupportGroupItem> = ({ onClick, item, selected }) => {
    
    return (
        <Flex
            w="180px"
            minH="150px"
            h="fit-content"
            bg="gray.100"
            cursor="pointer"
            onClick={onClick}
            direction="column"
            borderRadius="12px"
            border={item === selected ? "2.5px solid" : "none"}
            borderColor="blue.500"
        >
            <Image src={comm} borderTopLeftRadius="12px" borderTopRightRadius="12px" />
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

export default SupportGroupItem