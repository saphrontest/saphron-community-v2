import { IMessage } from '../Interface/ChatInterface'

const useChat = () => {
  
    const getMessagesByChatId = (chatId: string) => {}
    const sendMessage = (chatId: string, message: IMessage) => {}
    const deleteChat = (chatId: string) => {}
    const subscribe = (chatId: string) => {}
    const unsubscribe = (chatId: string) => {}

    return {
        sendMessage,
        deleteChat,
        getMessagesByChatId,
        subscribe,
        unsubscribe
    }
}

export default useChat
