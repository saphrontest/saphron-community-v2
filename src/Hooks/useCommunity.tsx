import { collection, deleteDoc, doc, FirestoreError, getDoc, getDocs, increment, query, runTransaction, setDoc, Transaction, where, writeBatch } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { Community, IPost, JoinedCommunity } from "../Interface";
import md5 from "md5";
import { useToast } from "@chakra-ui/react";
import moment from "moment";

const useCommunity = () => {

    const toast = useToast()

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

        try {
            const q = query(collection(firestore, "users", userId, "communities"));
            const querySnapshot = await getDocs(q)
            const communities = querySnapshot.docs.map((docSnapshot: any) => ({...docSnapshot.data()}));
            return communities
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
        
        
    }

    /**
     * The function `checkCommunityName` checks if a community name already exists in a Firestore
     * collection.
     * @param {string} name - The `name` parameter in the `checkCommunityName` function is a string
     * representing the name of a community that you want to check for existence in a Firestore
     * collection.
     * @returns The `checkCommunityName` function is returning a boolean value. It returns `true` if
     * there is a community document with the specified name in the Firestore collection, and `false`
     * if there is no such document.
     */
    const isCommunityNameExist = async ( name: string ) => {
        try {
            const communityDocRef = query(
                collection(firestore, `communities`),
                where("name", "==", name)
            )
            const communityDoc = await getDocs(communityDocRef)
            return !communityDoc.empty
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }
    }

    /**
     * The `onCreate` function creates a new community in Firestore if the community name is not
     * already taken.
     * @param {string} name - The `name` parameter in the `onCreate` function represents the name of
     * the community that is being created. It is a string value that will be used to identify the
     * community.
     * @param {string} userId - The `userId` parameter in the `onCreate` function represents the unique
     * identifier of the user who is creating a new community. This identifier is typically used to
     * associate the community with the user who created it and to perform actions specific to that
     * user, such as adding them as a moderator of the community
     */
    const onCreate = async ( name: string, userId: string ) => {

        try {

            const isCommunityExist = await isCommunityNameExist(name)
            
            if(isCommunityExist) {
                toast({
                    title: `Sorry, comm/${name} is taken. Try another.`,
                    status: "error",
                    isClosable: true,
                })
                throw new Error(`Sorry, comm/${name} is taken. Try another.`);
            }

            const newCommunityId = md5(`${name}.${new Date().getTime().toString()}`)

            // Create community document and community as a subcollection document on user
            const communityDocRef = doc(firestore, "communities", newCommunityId);

            await runTransaction(firestore, async (transaction: Transaction) => {

                transaction.set(communityDocRef, {
                    name: name,
                    creatorId: userId,
                    createdAt: moment().toString(),
                    numberOfMembers: 1,
                    privacyType: "public",
                });

                transaction.set(
                    doc(firestore, `users/${userId}/communities`, newCommunityId), {
                        communityId: newCommunityId,
                        isModerator: true,
                    }
                );

            });
        } catch (error) {
            if (error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
            }
        }

    }

    return {
        getPostsByCommunityId,
        getCommunityDetailById,
        getJoinedCommunities,
        getCommunitiesByUserId,
        getCommunities,
        joinCommunity,
        leaveCommunity,
        onCreate
    }
}

export default useCommunity
