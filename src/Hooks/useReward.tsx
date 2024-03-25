import { collection, doc, FirestoreError, getDocs, increment, query, runTransaction, Transaction, where } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { IReward, IRewardHistoryIncomeItem, IRewardHistoryExpenseItem } from "../Interface";


interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    img: string;
}


const useReward = () => {

    const getRewards = async () => {
        const q = collection(firestore, "rewards");
        const rewardsDocs = await getDocs(q);
        const result = await Promise.all(rewardsDocs.docs.map(item => {
            return { id: item.id, ...item.data() } as IReward
        }))
        return result as IReward[]
    }

    const getRewardBySlug = async (slug: string) => {
        const q = query(collection(firestore, "rewards"), where("slug", "==", slug));
        const data = await getDocs(q);
        return data.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] as IReward
    }

    const winRewardBySlug = async (slug: string, userId: string) => {
        try {
            const reward = await getRewardBySlug(slug)
            runTransaction(firestore, async (tx: Transaction) => {

                tx.update(doc(firestore, `users/${userId}`), {
                    rewardPoint: increment(reward.reward)
                })

                tx.set(doc(collection(firestore, `users/${userId}/rewardHistory`)), {
                    createdAt: new Date().toString(),
                    type: 'income',
                    rewardActionId: reward.id,
                    platform: reward.platform,
                    slug: reward.slug,
                    price: reward.reward
                })

            })
        } catch (error) {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        }
    }

    const buyRewardItem = async (userId: string, item: IProduct) => {

        try {

            const userRewardItemsDocRef = doc(collection(firestore, `users/${userId}/rewardItems`));
            const userRewardHistoryDocRef = doc(collection(firestore, `users/${userId}/rewardHistory`));

            runTransaction(firestore, async (tx: Transaction) => {

                tx.set(userRewardItemsDocRef, {
                    createdAt: new Date().toString(),
                    rewardItemId: item.id,
                    description: item.description,
                    img: item.img,
                    name: item.name,
                    price: item.price
                })

                tx.set(userRewardHistoryDocRef, {
                    createdAt: new Date().toString(),
                    type: 'expense',
                    rewardItemId: item.id,
                    description: item.description,
                    img: item.img,
                    name: item.name,
                    price: item.price
                })

            })

        } catch (error) {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        }

    }

    const getRewardHistory = async (userId: string) => {
        try {
            const rewardHistoryDocRef = collection(firestore, `users/${userId}/rewardHistory`)
            const rewardHistoryDoc = await getDocs(rewardHistoryDocRef)
            const rewardHistory = rewardHistoryDoc.docs.map(item => item.data())
            return rewardHistory as (IRewardHistoryExpenseItem | IRewardHistoryIncomeItem)[]
        } catch (error) {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        }
    }

    return {
        buyRewardItem,
        getRewards,
        getRewardBySlug,
        winRewardBySlug,
        getRewardHistory
    }
}

export default useReward
