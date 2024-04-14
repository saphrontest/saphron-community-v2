import { ChevronDownIcon } from "@chakra-ui/icons";
import { useBoolean, Flex, Menu, MenuButton, Button, MenuList, MenuItem, Text, Image } from "@chakra-ui/react";
import { FC } from "react";
import { ProductPriceLabel, DeleteAlert } from "../../../Components";
import { IRewardItem } from "../../../Interface";

const RewardItem: FC<{
    rewardItem: IRewardItem;
    handleDelete: (id: string) => void;
    toggleEditOpen: () => void;
    index: number
}> = ({ rewardItem, handleDelete, toggleEditOpen, index }) => {
    
    const [isDeleteOpen, {toggle: toggleDelete}] = useBoolean(false)

    const deleteHandler = () => handleDelete(rewardItem.id)
    
    return (
        <>
            <Flex
                w="100%"
                p="0.4rem"
                align={["flex-start", "center"]}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="1rem"
                justify="space-between"
                direction={["column", "row"]}
            >
                <Flex align={[ "flex-end", "center" ]} gap="1rem">
                    <Image src={rewardItem.img} w="100px" h="80px" borderRadius="0.6rem" />
                    <Flex direction="column" align="flex-start">
                        <Text color="gray">
                            #{index+1}
                        </Text>
                        <Text fontWeight="700">
                            {rewardItem.name}
                        </Text>
                    </Flex>
                </Flex>
                <Flex align="center" gap="1rem" w="100%" justify="flex-end">
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

export default RewardItem

