import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Menu, MenuButton, Button, MenuList, MenuItem, Image, Text, useBoolean } from '@chakra-ui/react'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { DeleteAlert, NewItemModal, ProductPriceLabel } from '../../../Components'
import { IRewardItem } from '../../../Interface'
import { useReward } from '../../../Hooks'
import { doc, runTransaction, Transaction } from 'firebase/firestore'
import { firestore } from '../../../firebaseClient'
import RewardItem from './RewardItem'

const EditItemModal: FC<{
    isOpen: boolean;
    item: IRewardItem;
    setOpen: () => void;
    reloadItems: () => void;
    handleEdit: (id: string, data: {
        name: string;
        price: number;
        img: string;
    }) => void;
}> = ({
    isOpen, setOpen, reloadItems, item, handleEdit
}) => (
    <NewItemModal
    item={item}
    isOpen={isOpen}
    setOpen={setOpen} 
    reloadItems={reloadItems}
    handleEdit={handleEdit}
    />
)

const RewardItems: FC<{ reloadItems: boolean; toggleReload: () => void; }> = ({ reloadItems, toggleReload }) => {

    const { getRewardItems } = useReward()
    const [isEditOpen, {toggle: toggleEdit}] = useBoolean(false)
    const [rewardItems, setRewardItems] = useState<IRewardItem[]>([])


    const handleDelete = async (id: string) => {
        await runTransaction(firestore, async (tx: Transaction) => {
            tx.delete(doc(firestore, `rewardItems/${id}`))
        }).finally(() => toggleReload())
    }

    const handleEdit = async (id: string, data: {
        name: string;
        price: number;
        img: string;
    }) => {
        await runTransaction(firestore, async (tx: Transaction) => {
            tx.update(doc(firestore, `rewardItems/${id}`), {...data})
        })
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
        <Flex mt="1rem" direction="column" gap="1rem">
            {rewardItems.map((rewardItem: IRewardItem, idx: number) => (
                <Fragment key={rewardItem.id}>
                    <RewardItem index={idx} handleDelete={handleDelete} rewardItem={rewardItem} toggleEditOpen={toggleEdit}/>
                    {isEditOpen && <EditItemModal
                    isOpen={isEditOpen}
                    setOpen={toggleEdit}
                    reloadItems={toggleReload}
                    item={rewardItem}
                    handleEdit={handleEdit}
                    />}
                </Fragment>
            ))}
        </Flex>
    )
}

export default RewardItems
