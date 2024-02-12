import { Transaction, collection, doc, runTransaction } from "firebase/firestore"
import { ISupportGroup, ISupportGroupParticipant } from "../Interface/SupportGroupInterface"
import { firestore } from "../firebaseClient"

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
     * The function `onJoin` is used to add a participant to a support group and update the
     * corresponding documents in Firestore.
     * @param {ISupportGroup} supportGroup - The supportGroup parameter is an object of type
     * ISupportGroup, which represents a support group. It contains information about the support
     * group, such as its ID and the support group manager.
     * @param {ISupportGroupParticipant} request - The `request` parameter is an object that represents
     * a support group participant. It contains properties such as `id`, which is the unique identifier
     * for the participant, and other relevant information about the participant.
     */

    const onJoin = (supportGroup: ISupportGroup, request: ISupportGroupParticipant) => {
        runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(
                doc(collection(firestore, `users/${supportGroup.support_group_manager_id}/supportGroupRequests`), request.id),
                { supportGroupId: supportGroup?.id }
            );
            transaction.set(
                doc(collection(firestore, `supportGroups/${supportGroup.id}/participants`), request.id),
                request
            );
        }).then(() => {
            return true
        }).catch(() => {
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
            transaction.set(doc(firestore, 'supportGroup', newGroup.id), newGroup)
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

    return {
        onJoin,
        onCreate,
        onDelete,
        onEdit
    }
  }
  
  export default useSupportGroup