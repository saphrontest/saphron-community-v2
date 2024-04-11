import { Flex, useBoolean } from '@chakra-ui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { NewItemModal} from '../../../Components'
import { IRewardItem } from '../../../Interface'
import { useReward } from '../../../Hooks'
import { doc, runTransaction, Transaction } from 'firebase/firestore'
import { firestore } from '../../../firebaseClient'
import AdminRewardItem from './AdminRewardItem'

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

const RewardItems: FC<{
    reloadItems: boolean;
    toggleReload: () => void;
    searchWord: string;
}> = ({ reloadItems, toggleReload, searchWord }) => {

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadItems])

    return (
        <Flex mt="1rem" direction="column" gap="1rem">
            {(
                rewardItems.filter(item => {
                    return (
                        item.name || item.name.toLowerCase()
                    ).includes(
                        searchWord.toLowerCase() || searchWord
                    )
                })
            ).map(( rewardItem: IRewardItem ) => (
                <Fragment key={rewardItem.id}>
                    <AdminRewardItem
                    handleDelete={handleDelete}
                    rewardItem={rewardItem}
                    toggleEditOpen={toggleEdit}
                    />
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
