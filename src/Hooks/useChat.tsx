import { FirestoreError, Transaction, collection, doc, getDocs, query, runTransaction } from 'firebase/firestore'
import { IMessage } from '../Interface'
import { firestore } from '../firebaseClient'
import md5 from 'md5'

const useChat = () => {
  
    /**
     * CREATE A NEW CHAT BY SUPPORT GROUP ID
     * The `onCreate` function creates a new chat room document in a support group collection in
     * Firestore using a transaction.
     * @param {string} supportGroupId - The `supportGroupId` parameter is a string that represents the
     * unique identifier of a support group.
     */
    const onCreate = async (supportGroupId: string) => {
        
        // TODO: every support group has only one chat room,
        // TODO: so if it exists, do not create
        
        const chatRoomId = md5(`${supportGroupId}.${new Date()}`)
        const supportGroupRef = doc(firestore, `supportGroups/${supportGroupId}/chatRoom/${chatRoomId}`)
        runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(supportGroupRef, {
                id: chatRoomId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        })

    }

    /**
     * GET CHAT ROOM ID BY SUPPORT GROUP ID
     * The function `getChatRoomIdBySupportGroupId` retrieves the chat room ID associated with a given
     * support group ID.
     * @param {string} supportGroupId - The `supportGroupId` parameter is a string that represents the
     * unique identifier of a support group.
     * @returns The function `getChatRoomIdBySupportGroupId` is returning the ID of the chat room
     * associated with the given `supportGroupId`.
     */
    const getChatRoomIdBySupportGroupId = async (supportGroupId: string) => {
        try {
            const supportGroupRef = query(collection(firestore, `supportGroups/${supportGroupId}/chatRoom`))
            const detail = await getDocs(supportGroupRef);
            return detail.docs[0].id
        } catch (error) {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        }
    }
    
    /**
     * SEND MESSAGE BY CHAT GROUP ID
     * The function `sendMessage` sends a message to a chat room in a Firestore database within a
     * transaction.
     * @param {string} chatId - The `chatId` parameter is a string that represents the unique
     * identifier of the chat room where the message will be sent.
     * @param {IMessage} message - The `message` parameter seems to be an object containing information
     * related to a message being sent in a chat room. It likely includes properties such as
     * `supportGroupId` (identifying the support group), `id` (unique identifier for the message), and
     * other message-related data.
     * @returns The `sendMessage` function returns a Promise that resolves to `true` if the transaction
     * is successful, and `false` if there is an error during the transaction.
     */
    const sendMessage = async (chatId: string, message: IMessage) => {
        const chatRef = doc(firestore, `supportGroups/${message.supportGroupId}/chatRoom/${chatId}/messages/${message.id}`)
        return runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(chatRef, message)
        })
        .then(() => true)
        .catch(() => false)
    }
    /**
     * DELETE CHAT ROOM BY SUPPORT GROUP ID
     * The `onDelete` function deletes a chat room document within a support group using Firestore
     * transactions in TypeScript React.
     * @param {string} supportGroupId - The `supportGroupId` parameter is a string that represents the
     * unique identifier of a support group.
     * @returns The `onDelete` function is returning a Promise. If the transaction is successful, it
     * will return `true`. If there is an error during the transaction, it will return `false`.
     */
    const onDelete = async (supportGroupId: string) => {
        const chatRoomRef = doc(collection(firestore, `supportGroups/${supportGroupId}/chatRoom`))
        return runTransaction(firestore, async (transaction: Transaction) => {
            transaction.delete(chatRoomRef)
        })
        .then(() => true)
        .catch(() => false)
    }

    return {
        sendMessage,
        onDelete,
        getChatRoomIdBySupportGroupId,
        onCreate
    }
}

export default useChat
