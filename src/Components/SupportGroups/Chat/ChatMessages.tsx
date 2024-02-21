import React, { FC, useEffect, useRef } from 'react'
import { IMessage, UserInterface } from '../../../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'

const ChatMessages: FC<{ messages: IMessage[] }> = ({ messages }) => {
    const messagesWrapperRef = useRef<HTMLDivElement | null>(null)
    const user: UserInterface = useSelector((state: RootState) => state.user)
    useEffect(() => {
        if(messagesWrapperRef.current) {

            messagesWrapperRef.current.scrollTop = messagesWrapperRef.current.scrollHeight;
        }
    }, [messages])
    return (
        <Flex w="100%" direction="column" gap="1rem" height="calc(100vh - 400px)" overflowY="auto" ref={messagesWrapperRef}>
            {
                messages.map((message: IMessage) => (
                    <Flex direction="column" align={user.id === message.userId ? "flex-end" : "flex-start"} gap="0.2rem">
                        <Flex
                        direction="column"
                        w="100%"
                        p="0.4rem 1rem"
                        borderRadius="1rem"
                        key={message.id}
                        align={user.id === message.userId ? "flex-end" : "flex-start"}
                        bg={user.id === message.userId ? "blue.500" :"gray.100"}
                        color={user.id === message.userId ? "white" : "gray.800"}
                        >
                            {user.id !== message.userId && (
                                <>
                                    <Flex
                                    direction="row"
                                    gap="0.5rem"
                                    align="center"
                                    borderRadius="1rem"
                                    w="fit-content"
                                    >
                                        <Avatar src={message.userAvatar} w="24px" h="24px"/>
                                        <Text fontWeight="bold">{message.userName}</Text>
                                    </Flex>
                                    <Divider marginY="0.5rem" borderColor="blue.500"/>
                                </>
                            )}
                            {message.content}
                        </Flex>
                    </Flex>
                ))
            }
        </Flex>
    )
}

export default ChatMessages
