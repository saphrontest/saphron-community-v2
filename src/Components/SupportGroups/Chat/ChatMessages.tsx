import React, { FC, Fragment, useEffect, useRef } from 'react'
import { IMessage, IUser } from '../../../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { Flex } from '@chakra-ui/react'
import ChatMessageItem from './ChatMessageItem'

const ChatMessages: FC<{
    adminId: string;
    messages: IMessage[];
}> = ({ messages, adminId }) => {

    const messagesWrapperRef = useRef<HTMLDivElement | null>(null)
    const user: IUser = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (messagesWrapperRef.current) {
            messagesWrapperRef.current.scrollTop = messagesWrapperRef.current.scrollHeight;
        }
    }, [messages])

    return (
        <Flex
            w="100%"
            gap="1rem"
            overflowY="auto"
            direction="column"
            ref={messagesWrapperRef}
            height="calc(100vh - 400px)"
        >
            {
                messages.map((message: IMessage) => (
                    <Fragment key={message.id}>
                        <ChatMessageItem
                            message={message}
                            isUserMessage={user.id === message.userId}
                            isAdminMessage={adminId === message.userId}
                        />
                    </Fragment>
                ))
            }
        </Flex>
    )
}

export default ChatMessages
