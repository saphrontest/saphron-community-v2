import { collection, doc, getDocs, increment, query, runTransaction, Transaction, where } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { IReward } from "../Interface";

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
            })
        } catch (error) {
            
        }
    }

    return {
        getRewards,
        getRewardBySlug,
        winRewardBySlug
    }
}

export default useReward
