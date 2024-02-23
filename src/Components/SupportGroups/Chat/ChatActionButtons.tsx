import { Flex, Button, useBoolean, Spinner, useToast } from '@chakra-ui/react'
import { InputItem } from '../../../Layouts'
import { useChat } from '../../../Hooks'
import { FC, FormEvent, useState } from 'react'
import md5 from 'md5'
import { IUser } from '../../../Interface'

const ChatActionButtons: FC<{
    chatId: string;
    supportGroupId: string;
    user: IUser;
    isConfirmedParticipant: boolean;
    isAdmin: boolean;
}> = ({
    chatId,
    user,
    supportGroupId,
    isConfirmedParticipant,
    isAdmin
}) => {
    const { sendMessage } = useChat()
    const toast = useToast()
    const [loadingSendMessage, { toggle: toggleLoadingSendMessage }] = useBoolean(false)
    const [messageText, setMessageText] = useState<string>("")
    const send = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(!isConfirmedParticipant && !isAdmin) {
            toast({
                title: "You should be confirmed participant to send a message!",
                status: "error",
                isClosable: true,
                position: "top-right"
            })
            return;
        }
        
        if (!chatId) {
            return;
        }
        toggleLoadingSendMessage()
        const messageId = md5(`${messageText}.${new Date()}`)
        sendMessage(chatId, {
            userId: user.id,
            userAvatar: user.profilePhotoURL,
            userMail: user.email,
            userName: user.username,
            supportGroupId,
            id: messageId,
            date: new Date().toString(),
            content: messageText
        })
            .then(res => res && setMessageText(""))
            .finally(() => toggleLoadingSendMessage())
    }

    return (
        <form onSubmit={send} style={{
            position: "relative",
            bottom: 0
        }}>
            <Flex direction="row" gap="0.7rem" mt="1rem">
                <InputItem name="message" type='text' value={messageText} onChange={ev => setMessageText(ev.target.value)} disabled={!isConfirmedParticipant && !isAdmin}/>
                <Button borderRadius="0.5rem" type='submit'>{loadingSendMessage ? <Spinner /> : "Send"}</Button>
            </Flex>
        </form>
    )
}

export default ChatActionButtons
