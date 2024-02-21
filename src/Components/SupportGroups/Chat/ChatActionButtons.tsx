import { Flex, Button, useBoolean, Spinner } from '@chakra-ui/react'
import { InputItem } from '../../../Layouts'
import { useChat } from '../../../Hooks'
import { FC, FormEvent, useState } from 'react'
import md5 from 'md5'
import { UserInterface } from '../../../Interface'

const ChatActionButtons: FC<{ chatId: string; supportGroupId: string; user: UserInterface; }> = ({
    chatId,
    user,
    supportGroupId
}) => {
    const { sendMessage } = useChat()
    const [loadingSendMessage, { toggle: toggleLoadingSendMessage }] = useBoolean(false)
    const [messageText, setMessageText] = useState<string>("")
    const send = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
                <InputItem name="message" type='text' value={messageText} onChange={ev => setMessageText(ev.target.value)} />
                <Button borderRadius="0.5rem" type='submit'>{loadingSendMessage ? <Spinner /> : "Send"}</Button>
            </Flex>
        </form>
    )
}

export default ChatActionButtons
