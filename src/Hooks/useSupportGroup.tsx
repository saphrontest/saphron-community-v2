import { Transaction, collection, doc, runTransaction } from "firebase/firestore"
import { ISupportGroup, ISupportGroupParticipant } from "../Interface/SupportGroupInterface"
import { firestore } from "../firebaseClient"

const useSupportGroup = () => {

    const onJoin = (supportGroup: ISupportGroup, request: ISupportGroupParticipant) => {
        runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(
                doc(collection(firestore, `users/${supportGroup.support_group_manager_id}/supportGroupRequests`), request.id),
                { supportGroupId: supportGroup.id }
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

    const onCreate = async (newGroup: ISupportGroup) => {
        const newGroupRef = doc(firestore, 'supportGroup', newGroup.id)
        runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(newGroupRef, newGroup)
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