import { collection, doc, FirestoreError, getDocs, increment, orderBy, query, runTransaction, Transaction, where } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { IReward, IRewardHistoryItem, IRewardItem, IUserRewardItem } from "../Interface";


interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    img: string;
}


const useReward = () => {

    const handleFirebaseError = (error: unknown) => {
        if(error instanceof FirestoreError) {
            console.error(error.message)
            throw new Error(error.message)
          }
    }

    /**
     * The function `getRewards` retrieves reward data from a Firestore collection and returns it as an
     * array of objects conforming to the `IReward` interface.
     * @returns The `getRewards` function is returning an array of objects that represent rewards. Each
     * object contains an `id` property (corresponding to the document ID in Firestore) and all the
     * data fields from the Firestore document. The return type is specified as `IReward[]`, indicating
     * that the function returns an array of objects that adhere to the `IReward` interface or type.
     */
    const getRewards = async () => {
        const q = collection(firestore, "rewards");
        const rewardsDocs = await getDocs(q);
        const result = await Promise.all(rewardsDocs.docs.map(item => {
            return { id: item.id, ...item.data() } as IReward
        }))
        return result as IReward[]
    }

    /**
     * The function `getRewardBySlug` retrieves a reward document from a Firestore collection based on
     * a provided slug.
     * @param {string} slug - The `slug` parameter is a string that represents a unique identifier or
     * key associated with a reward. It is used to query the Firestore database to retrieve information
     * about a specific reward based on its slug.
     * @returns The function `getRewardBySlug` is returning the first document that matches the
     * provided `slug` from the "rewards" collection in Firestore. It returns the document data along
     * with its id as an object of type `IReward`.
     */
    const getRewardBySlug = async (slug: string) => {
        const q = query(collection(firestore, "rewards"), where("slug", "==", slug));
        const data = await getDocs(q);
        return data.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] as IReward
    }

    /**
     * The function `winRewardBySlug` asynchronously retrieves a reward by slug and updates the user's
     * reward points and reward history in Firestore.
     * @param {string} slug - The `slug` parameter is a string that represents a unique identifier for
     * a specific reward in the system. It is used to retrieve information about the reward associated
     * with that slug.
     * @param {string} userId - The `userId` parameter in the `winRewardBySlug` function is a string
     * that represents the unique identifier of the user who will receive the reward.
     */
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
            return handleFirebaseError(error)
        }
    }

    /**
     * The function `buyRewardItem` is an asynchronous function that buys a reward item for a user and
     * updates their reward items and history in Firestore transactionally.
     * @param {string} userId - The `userId` parameter in the `buyRewardItem` function represents the
     * unique identifier of the user who is purchasing the reward item.
     * @param {IProduct} item - The `item` parameter in the `buyRewardItem` function represents an
     * object of type `IProduct`. This object contains properties such as `id`, `description`, `img`,
     * `name`, and `price`, which are used to create entries in the user's reward items and reward
     * history documents
     */
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
            return handleFirebaseError(error)
        }

    }

    /**
     * This function retrieves a user's reward history from Firestore and returns it as an array of
     * objects.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of a user for whom you want to retrieve the reward history.
     * @returns The `getRewardHistory` function returns an array of reward history items for a specific
     * user, represented as an array of objects with each object containing an `id` field and
     * additional data fields. The return type is specified as `IRewardHistoryItem[]`.
     */
    const getRewardHistory = async (userId: string) => {
        try {
            const rewardHistoryDocRef = query(collection(firestore, `users/${userId}/rewardHistory`), orderBy('createdAt', 'desc'))
            const rewardHistoryDoc = await getDocs(rewardHistoryDocRef)
            const rewardHistory = rewardHistoryDoc.docs.map(doc => ({id: doc.id, ...doc.data()}))
            return rewardHistory as IRewardHistoryItem[]
        } catch (error) {
            return handleFirebaseError(error)
        }
    }

    /**
     * The function `getUserRewardItems` retrieves a user's reward items from Firestore using the
     * user's ID.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of a user for whom we want to retrieve reward items.
     * @returns The `getUserRewardItems` function returns an array of reward items belonging to a
     * specific user, with each item containing an `id` field and additional data specific to the
     * reward item. If there is an error during the process, the function will return the result of the
     * `handleFirebaseError` function.
     */
    const getUserRewardItems = async (userId: string) => {
        try {
            const rewardItemsDocRef = query(collection(firestore, `users/${userId}/rewardItems`), orderBy('createdAt', 'desc'));
            const rewardItemsDoc = await getDocs(rewardItemsDocRef)
            const rewardItems = rewardItemsDoc.docs.map(doc => ({id: doc.id, ...doc.data()} as IUserRewardItem))
            return rewardItems
        } catch (error) {
            return handleFirebaseError(error)
        }
    }
    
    const getRewardItems = async () => {
        try {
            const rewardItemsDocRef = query(collection(firestore, `rewardItems`))
            const rewardItemsDoc = await getDocs(rewardItemsDocRef)
            const rewardItems = rewardItemsDoc.docs.map(doc => ({id: doc.id, ...doc.data()}))
            return rewardItems as IRewardItem[];
        } catch (error) {
            return handleFirebaseError(error)
        }
    }

    return {
        buyRewardItem,
        getRewards,
        getRewardBySlug,
        winRewardBySlug,
        getRewardHistory,
        getUserRewardItems,
        getRewardItems
    }
}

export default useReward
