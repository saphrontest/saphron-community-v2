import { collection, deleteDoc, doc, FirestoreError, getDoc, getDocs, increment, query, setDoc, where, writeBatch } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { Community, IPost, JoinedCommunity } from "../Interface";

const useCommunity = () => {

    /**
     * The function `getCommunities` retrieves a list of communities from a Firestore database in a
     * TypeScript React application.
     * @returns The `getCommunities` function returns an array of community objects, where each object
     * contains an `id` property representing the document ID and other properties representing the
     * data of the community.
     */
    const getCommunities = async () => {
        try {
            const communitiesDocRef = collection(firestore, "communities")
            const communitiesDoc = await getDocs(communitiesDocRef)
            const communities = communitiesDoc.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community))
            return communities
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
    }

    /**
     * The function `getPostsByCommunityId` retrieves posts from a Firestore collection based on a
     * specified community ID.
     * @param {string} communityId - The `communityId` parameter is a string that represents the unique
     * identifier of a community. This function `getPostsByCommunityId` retrieves posts from a
     * Firestore database that belong to the specified community based on the provided `communityId`.
     * @returns The function `getPostsByCommunityId` is returning an array of posts that belong to the
     * community with the specified `communityId`. Each post in the array is an object with properties
     * including `id` and other data related to the post.
     */
    const getPostsByCommunityId = async (communityId: string) => {

        try {
            const postsDocRef = query(collection(firestore, "posts"), where("communityId", "==", communityId))
            const postsDoc = await getDocs(postsDocRef);
            const posts = postsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() } as IPost))
            return posts
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }

    };

    /**
     * The function `getCommunityDetailById` retrieves details of a community from Firestore using its
     * ID in a TypeScript React application.
     * @param {string} communityId - The `communityId` parameter is a string that represents the unique
     * identifier of a community in the Firestore database.
     * @returns The `getCommunityDetailById` function returns a Promise that resolves to an object
     * representing a community with the specified `communityId`. The object contains the `id` property
     * which is the `communityId`, and other properties and data associated with the community. If an
     * error occurs during the process, it will be caught and rethrown with the error message logged to
     * the console.
     */
    const getCommunityDetailById = async (communityId: string) => {
        try {
            const communityDocRef = doc(firestore, "communities", communityId)
            const communityDoc = await getDoc(communityDocRef)
            const community = { id: communityDoc.id, ...communityDoc.data() } as Community
            return community
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
    }

    /**
     * This function retrieves a user's joined communities from Firestore using the user's ID.
     * @param {string} userId - The `userId` parameter is a string representing the unique identifier
     * of a user for whom we want to retrieve the communities they have joined.
     * @returns The `getJoinedCommunities` function returns an array of objects representing the
     * communities that a user with the specified `userId` has joined. Each object in the array
     * contains the data of a joined community.
     */
    const getJoinedCommunities = async (userId: string) => {
        try {
            const joinedDocRef = query(collection(firestore, `users/${userId}/communities`))
            const joinedDoc = await getDocs(joinedDocRef)
            const joined = joinedDoc.docs.map(doc => ({ ...doc.data() } as JoinedCommunity))
            return joined
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
    }

    /**
     * The function `joinCommunity` asynchronously adds a user to a community in Firestore and updates
     * the number of members in the community.
     * @param {string} userId - The `userId` parameter in the `joinCommunity` function represents the
     * unique identifier of the user who is joining the community.
     * @param {string} communityId - The `communityId` parameter in the `joinCommunity` function
     * represents the unique identifier of the community that a user wants to join. It is used to
     * identify the specific community in the Firestore database where the user will be added as a
     * member.
     */
    const joinCommunity = async (userId: string, communityId: string) => {
        try {
            const joinCommunityRef = doc(firestore, "users", userId, "communities", communityId);
            const communityRef = doc(firestore, "communities", communityId)
            await setDoc(joinCommunityRef, { communityId, isModerator: false })
            const batch = writeBatch(firestore)
            batch.update(communityRef, {
                numberOfMembers: increment(+1)
            })
            batch.commit()
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
    }

    /**
     * The function `leaveCommunity` removes a user from a community and updates the number of members
     * in the community.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of the user who wants to leave a community.
     * @param {string} communityId - The `communityId` parameter in the `leaveCommunity` function
     * represents the unique identifier of the community from which the user wants to leave. This
     * identifier is used to locate and update the necessary documents in the Firestore database
     * related to the user's membership in that community.
     */
    const leaveCommunity = async (userId: string, communityId: string) => {
        try {
            const userCommunityRef = doc(firestore, "users", userId, "communities", communityId);
            const communityRef = doc(firestore, "communities", communityId)
            await deleteDoc(userCommunityRef)
            const batch = writeBatch(firestore)
            batch.update(communityRef, {
                numberOfMembers: increment(-1)
            })
            batch.commit()
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
    }

    /**
     * The function `getCommunitiesByUserId` retrieves a user's communities from Firestore based on
     * their user ID.
     * @param {string} userId - The `userId` parameter in the `getCommunitiesByUserId` function is a
     * string that represents the unique identifier of a user. This function retrieves a list of
     * communities associated with the user identified by the `userId`.
     * @returns An array of communities associated with the user ID provided. Each community is
     * represented as an object with its data properties.
     */
    const getCommunitiesByUserId = async (userId: string) => {
        const q = query(collection(firestore, "users", userId, "communities"));
        const querySnapshot = await getDocs(q)
        const communities = querySnapshot.docs.map((docSnapshot: any) => ({...docSnapshot.data()}));
        return communities
    }

    return {
        getPostsByCommunityId,
        getCommunityDetailById,
        getJoinedCommunities,
        getCommunitiesByUserId,
        getCommunities,
        joinCommunity,
        leaveCommunity
    }
}

export default useCommunity
