import { Button } from '@chakra-ui/button';
import { useBoolean } from '@chakra-ui/hooks';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu';
import React, { FC } from 'react'
import { ProductPriceLabel, DeleteAlert } from '../../../Components';
import { IRewardItem } from '../../../Interface';
import { Image } from '@chakra-ui/image';

const AdminRewardItem: FC<{
    rewardItem: IRewardItem;
    handleDelete: (id: string) => void;
    toggleEditOpen: () => void;
}> = ({ rewardItem, handleDelete, toggleEditOpen }) => {
    
    const [isDeleteOpen, {toggle: toggleDelete}] = useBoolean(false)

    const deleteHandler = () => handleDelete(rewardItem.id)
    
    return (
        <>
            <Flex
                w="100%"
                p="0.4rem"
                align="center"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="1rem"
                justify="space-between"
            >
                <Flex align="center" gap="1rem">
                    <Image src={rewardItem.img} w="100px" h="80px" borderRadius="0.6rem" />
                    <Flex direction="column" align="flex-start">
                        <Text color="gray">
                            #{rewardItem.id}
                        </Text>
                        <Text fontWeight="700">
                            {rewardItem.name}
                        </Text>
                    </Flex>
                </Flex>
                <Flex align="center" gap="1rem">
                    <ProductPriceLabel price={rewardItem.price || 0} />
                    <Menu>
                        <MenuButton variant="outline" as={Button}>
                            <ChevronDownIcon fontSize="22px" />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={toggleDelete}>Delete</MenuItem>
                            <MenuItem onClick={toggleEditOpen}>Edit</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <DeleteAlert
                isOpen={isDeleteOpen}
                toggleDialog={toggleDelete}
                handleDelete={deleteHandler}
                label={''}
            />
        </>
    )
}

export default AdminRewardItem
