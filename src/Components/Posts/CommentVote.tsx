import { Flex, Icon, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowUpCircleOutline, IoArrowUpCircleSharp } from 'react-icons/io5'
import { ICommentVote } from '../../Interface';
interface CommentVoteProps {
    userVote: ICommentVote;
    onVote: (value: number, userId: string) => void;
    userId: string;
    voteValue: number;
}
const CommentVote:FC<CommentVoteProps> = ({userVote, onVote, userId, voteValue}) => {
    return (
        <Flex gap={1} alignItems={"center"}>
            <Icon
                as={userVote?.value === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                color={userVote?.value === 1 ? "brand.100" : "gray.400"}
                fontSize={17}
                cursor="pointer"
                onClick={(e) => userId && onVote(1, userId)}
            />
            <Text fontSize={9} fontWeight={600} color={"black"}>{voteValue ?? 0}</Text>
            <Icon
                as={userVote?.value === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                color={userVote?.value === -1 ? "#4379FF" : "gray.400"}
                fontSize={17}
                cursor="pointer"
                onClick={(e) => userId && onVote(-1, userId)}
            />
        </Flex>
    )
}

export default CommentVote