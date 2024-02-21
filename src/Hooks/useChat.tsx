import { Transaction, collection, doc, getDocs, query, runTransaction } from 'firebase/firestore'
import { IMessage } from '../Interface'
import { firestore } from '../firebaseClient'
import md5 from 'md5'

const useChat = () => {
  
    const onCreate = async (supportGroupId: string) => {
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

    const getChatRoomIdBySupportGroupId = async (supportGroupId: string) => {
        const supportGroupRef = query(collection(firestore, `supportGroups/${supportGroupId}/chatRoom`))
        const detail = await getDocs(supportGroupRef);
        return detail.docs[0].id
    }
    
    const sendMessage = async (chatId: string, message: IMessage) => {
        const chatRef = doc(firestore, `supportGroups/${message.supportGroupId}/chatRoom/${chatId}/messages/${message.id}`)
        return runTransaction(firestore, async (transaction: Transaction) => {
            transaction.set(chatRef, message)
        })
        .then(() => true)
        .catch(() => false)
    }
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
