import { Flex, Avatar, Divider, Text } from '@chakra-ui/react'
import moment from 'moment'
import React, { FC } from 'react'
import { LuCrown } from 'react-icons/lu'
import { IMessage } from '../../../Interface'

const ChatMessageItem: FC<{
    message: IMessage;
    isUserMessage: boolean;
    isAdminMessage: boolean;
}> = ({
    message, isUserMessage, isAdminMessage
}) => {
        return (
            <Flex
                gap="0.2rem"
                key={message.id}
                direction="column"
                align={isUserMessage ? "flex-end" : "flex-start"}
            >
                <Flex
                    w="100%"
                    p="0.4rem 1rem"
                    direction="column"
                    borderRadius="1rem"
                    bg={isUserMessage ? "blue.500" : "gray.100"}
                    color={isUserMessage ? "white" : "gray.800"}
                    align={isUserMessage ? "flex-end" : "flex-start"}
                >
                    <Flex
                        gap="0.5rem"
                        align="center"
                        w="fit-content"
                        direction="row"
                        borderRadius="1rem"
                    >
                        <Avatar src={message.userAvatar} w="24px" h="24px" />
                        <Text fontWeight="bold">{message.userName}</Text>
                        {isAdminMessage && <LuCrown width="30px" />}
                    </Flex>
                    <Divider marginY="0.5rem" borderColor={isUserMessage ? "white" : "blue.500"} />
                    <Text fontWeight={600}>
                        {message.content}
                    </Text>
                    <Divider borderColor={isUserMessage ? "white" : "blue.500"} marginY="0.4rem" />
                    <Text fontWeight={500} marginTop={!isUserMessage ? "0.5rem" : 0}>
                        {moment(new Date(message.date)).fromNow()}
                    </Text>
                </Flex>
            </Flex>
        )
    }

export default ChatMessageItem
