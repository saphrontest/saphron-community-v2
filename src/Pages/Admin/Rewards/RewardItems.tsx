import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Menu, MenuButton, Button, MenuList, MenuItem, Image, Text, useBoolean } from '@chakra-ui/react'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { DeleteAlert, ProductPriceLabel } from '../../../Components'
import { IRewardItem } from '../../../Interface'
import { useReward } from '../../../Hooks'
import { doc, runTransaction, Transaction } from 'firebase/firestore'
import { firestore } from '../../../firebaseClient'

const RewardItem: FC<{ rewardItem: IRewardItem; handleDelete: (id: string) => void; }> = ({ rewardItem, handleDelete }) => {
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
                            <MenuItem>Edit</MenuItem>
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

const RewardItems: FC<{ reloadItems: boolean; toggleReload: () => void; }> = ({ reloadItems, toggleReload }) => {

    const { getRewardItems } = useReward()
    const [rewardItems, setRewardItems] = useState<IRewardItem[]>([])


    const handleDelete = async (id: string) => {
        await runTransaction(firestore, async (tx: Transaction) => {
            tx.delete(doc(firestore, `rewardItems/${id}`))
        }).finally(() => toggleReload())
    }

    useEffect(() => {
        getRewardItems()
            .then(res => res && setRewardItems(res))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (reloadItems) {
            getRewardItems()
                .then(res => res && setRewardItems(res))
                .finally(() => toggleReload())
        }
    }, [reloadItems])

    return (
        <>
            <Flex mt="1rem" direction="column" gap="1rem">
                {rewardItems.map(rewardItem => (
                    <Fragment key={rewardItem.id}>
                        <RewardItem handleDelete={handleDelete} rewardItem={rewardItem} />
                    </Fragment>
                ))}
            </Flex>
        </>
    )
}

export default RewardItems
