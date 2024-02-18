import {
    doc,
    query,
    getDoc, 
    getDocs,
    collection,
    Transaction,
    runTransaction,
    QueryDocumentSnapshot
} from "firebase/firestore"
import { ISupportGroup, ISupportGroupParticipant } from "../Interface/SupportGroupInterface"
import { firestore } from "../firebaseClient"
import { createSlug } from "../Helpers"

/**
 * The `useSupportGroup` function provides helper functions for managing support groups in a TypeScript
 * React application.
 * @returns The `useSupportGroup` function returns an object with four properties: `onJoin`,
 * `onCreate`, `onDelete`, and `onEdit`. These properties are functions that can be used to perform
 * various operations related to support groups, such as joining a support group, creating a new
 * support group, deleting a support group, and editing a support group.
 */

const useSupportGroup = () => {

    /**
     * The `onJoin` function is used to add a user to a support group by creating a support group
     * request and adding the user as a participant.
     * @param {ISupportGroup} supportGroup - The `supportGroup` parameter is of type `ISupportGroup`,
     * which represents a support group object. It likely contains information such as the support
     * group's ID, name, description, and other relevant details.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of the user who wants to join the support group.
     * @param {ISupportGroupParticipant} request - The `request` parameter is an object that represents
     * the participant's request to join the support group. It contains information such as the
     * participant's ID, name, and any additional details required for joining the support group.
     * @returns a Promise that resolves to a boolean value of `true` if the transaction is successful.
     */
    const onJoin = async (supportGroup: ISupportGroup, userId: string, request: ISupportGroupParticipant) => {
        return runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(
                doc(collection(firestore, `users/${userId}/supportGroupRequests`), request.id),
                { supportGroupId: supportGroup?.id }
            )
            transaction.set(
                doc(collection(firestore, `supportGroups/${supportGroup.id}/participants`), request.id),
                request
            )
        }).then(() => {
            return true
        }).catch((err) => {
            throw new Error('Could not join the support group, please try again later!')
        })
    }

    /**
     * The `onCreate` function creates a new support group and adds it to Firestore, along with adding
     * the support group ID to the user's support groups.
     * @param {ISupportGroup} newGroup - The `newGroup` parameter is an object of type `ISupportGroup`.
     * It represents the data for a new support group that is being created.
     */

    const onCreate = async (newGroup: ISupportGroup) => {
        runTransaction(firestore, async (transaction: Transaction) => {
            if(!newGroup.id) {
                return;
            }
            transaction.set(doc(firestore, 'supportGroups', newGroup.id), newGroup)
            transaction.set(doc(firestore, `users/${newGroup.support_group_manager_id}/supportGroups`, newGroup.id), {
                supportGroupId: newGroup.id,
                isModerator: true
            })
        }).then(() => {
            return true
        }).catch(() => {
            throw new Error('Could not create a support group, please try again later!')
        })
    }

    /**
     * The `onDelete` function deletes a support group and its corresponding entry in the user's
     * support groups collection.
     * @param {ISupportGroup} supportGroup - The `supportGroup` parameter is an object of type
     * `ISupportGroup`. It represents a support group and contains information such as its `id`, the
     * `support_group_manager_id` and etc. of the user who manages the support group.
     */

    const onDelete = async (supportGroup: ISupportGroup) => {
        await runTransaction(firestore, async (transaction: Transaction) => {
            transaction.delete(doc(firestore, `supportGroups/${supportGroup.id}`))
            transaction.delete(doc(firestore, `users/${supportGroup.support_group_manager_id}/supportGroups/${supportGroup.id}`))
        }).then(() => {
            return true
        }).catch(() => {
            throw new Error('Could not delete the support group, please try again later!')
        })
    }

    /**
     * The function `onEdit` updates a support group document in Firestore using a transaction.
     * @param {ISupportGroup} supportGroup - The `supportGroup` parameter is an object of type
     * `ISupportGroup`. It represents a support group and contains various properties such as `id`,
     * `name`, `description`, etc.
     */

    const onEdit = async (supportGroup: ISupportGroup) => {
        await runTransaction(firestore, async (transaction: Transaction) => {
            transaction.update(doc(firestore, `supportGroups/${supportGroup.id}`), {...supportGroup})
        }).then(() => {
            return true
        }).catch(() => {
            throw new Error('Could not edit the support group, please try again later!')
        })
    }

    
    /**
     * The function `getSupportGroups` retrieves support groups from a Firestore database, including
     * their participants, and returns them as an array.
     * @returns The function `getSupportGroups` returns an array of `ISupportGroup` objects.
     */
    const getSupportGroups = async () => {
        const result: ISupportGroup[] = []
        const data = await getDocs(query(collection(firestore, 'supportGroups')));
    
        const promises = data.docs.map(async (data: QueryDocumentSnapshot) => {
            const participants = await getParticipantsBySupportGroupId(data.id)
            return {
                ...data.data(),
                id: data.id,
                participants: participants.length ? participants : []
            } as ISupportGroup;
        });
    
        // Wait for all promises to resolve using Promise.all
        const supportGroups = await Promise.all(promises);
        result.push(...supportGroups);
    
        return result;
    }

    /**
     * The function `getSupportGroupById` retrieves a support group from Firestore based on its ID.
     * @param {string} supportGroupId - The `supportGroupId` parameter is a string that represents the
     * unique identifier of a support group.
     * @returns The function `getSupportGroupById` returns a Promise that resolves to an object of type
     * `ISupportGroup`.
     */
    const getSupportGroupById = async (supportGroupId: string) => {
        const supportGroup = await getDoc(doc(firestore, 'supportGroups', supportGroupId));
        return supportGroup.data() as ISupportGroup
    }

    /**
     * This function retrieves participants belonging to a support group specified by its ID.
     * @param {string} supportGroupId - The `supportGroupId` parameter is a string that represents the
     * unique identifier of a support group.
     * @returns The `getParticipantsBySupportGroupId` function is returning a Promise that resolves to
     * an array of `ISupportGroupParticipant` objects. The function fetches participant data from a
     * Firestore collection based on the `supportGroupId` provided as a parameter.
     */
    const getParticipantsBySupportGroupId = async (supportGroupId: string) => {
        const result: ISupportGroupParticipant[] = []
        const data = await getDocs(query(collection(firestore, `supportGroups/${supportGroupId}/participants`)));
        data.forEach(async (data: QueryDocumentSnapshot) => {
            result.push(data.data() as ISupportGroupParticipant)
        })
        return result;
    }

    /**
     * The function `getSupportGroupBySlug` retrieves a support group by its slug from a list of
     * support groups.
     * @param {string} slug - The `slug` parameter is a string that represents a unique identifier for
     * a support group. It is used to search for a specific support group by its slug in the
     * `getSupportGroupBySlug` function.
     * @returns The function `getSupportGroupBySlug` is returning a promise that resolves to an
     * `ISupportGroup` object or `undefined`.
     */
    const getSupportGroupBySlug = async (slug: string) => {
        const supportGroups = await getSupportGroups()
        const result: ISupportGroup | undefined = supportGroups.find(({support_group_name}) => createSlug(support_group_name) === slug)
        return result
    }

    /**
     * The function `getSupportGroupsByUserId` retrieves support groups based on a specified user ID.
     * @param {string} userId - The `userId` parameter is a string representing the unique identifier
     * of a user.
     * @returns The function `getSupportGroupsByUserId` returns an array of support groups where the
     * `support_group_manager_id` matches the provided `userId`.
     */
    const getSupportGroupsByUserId = async (userId: string) => {
        const groups = await getSupportGroups()
        const result: ISupportGroup[] = groups.filter(({support_group_manager_id}) => support_group_manager_id === userId)
        return result
    }

    return {
        onEdit,
        onJoin,
        onCreate,
        onDelete,
        getSupportGroups,
        getSupportGroupById,
        getSupportGroupBySlug,
        getSupportGroupsByUserId
    }
  }
  
  export default useSupportGroup