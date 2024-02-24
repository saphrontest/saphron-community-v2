import { Flex, Avatar, Divider, Text } from '@chakra-ui/react'
import moment from 'moment'
import { FC } from 'react'
import { LuCrown } from 'react-icons/lu'
import { IMessage } from '../../../Interface'

interface IChatMessageItemProps {
    message: IMessage;
    isUserMessage: boolean;
    isAdminMessage: boolean;
}

const ChatMessageItem: FC<IChatMessageItemProps> = ({ message, isUserMessage, isAdminMessage }) => {
        return (
            <Flex gap="0.2rem" direction="column" align={isUserMessage ? "flex-end" : "flex-start"}>
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
                        <Avatar src={message.userAvatar} w={{base: "16px", sm: "24px"}} h={{base: "16px", sm: "24px"}} />
                        <Text fontWeight="bold" fontSize={{base: "12px", sm: "16px"}} >
                            {message.userName}
                        </Text>
                        {isAdminMessage && <LuCrown width="30px" />}
                    </Flex>
                    <Divider marginY="0.5rem" borderColor={isUserMessage ? "white" : "blue.500"} />
                    <Text fontWeight={600} fontSize={{base: "12px", sm: "16px"}} >
                        {message.content}
                    </Text>
                    <Divider marginY={{base: "0.2rem", sm: "0.4rem"}} borderColor={isUserMessage ? "white" : "blue.500"} />
                    <Text fontWeight={500} fontSize={{base: "10px", sm: "16px"}} marginTop={!isUserMessage ? "0.5rem" : 0}>
                        {moment(new Date(message.date)).fromNow()}
                    </Text>
                </Flex>
            </Flex>
        )
    }

export default ChatMessageItem
