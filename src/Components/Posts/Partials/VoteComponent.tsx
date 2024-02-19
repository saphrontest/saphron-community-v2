import { Flex, Icon, Spinner, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowUpCircleOutline, IoArrowUpCircleSharp } from 'react-icons/io5'
import { IPost, IPostVote } from '../../../Interface';

interface VoteProps {
    onVote: (ev: React.MouseEvent<SVGElement, MouseEvent>, vote: number) => void;
    isVoteLoading: boolean;
    userVote: IPostVote | null;
    post: IPost
}

const VoteComponent: FC<VoteProps> = ({
    onVote,
    isVoteLoading,
    userVote,
    post
}) => {
  return (
    <Flex
        direction="column"
        align="center"
        bg={"gray.100"}
        p={2}
        width="40px"
        borderRadius={"3px 0px 0px 3px"}
        >
        {isVoteLoading ? <Spinner size="sm" /> : (
          <>
            <Icon
              as={
                userVote?.voteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
              }
              color={userVote?.voteValue === 1 ? "brand.100" : "gray.400"}
              fontSize={22}
              cursor="pointer"
              onClick={(event) => onVote(event, 1)}
            />
            <Text fontSize="9pt" fontWeight={600}>
              {post.voteStatus}
            </Text>
            <Icon
              as={
                userVote?.voteValue === -1
                  ? IoArrowDownCircleSharp
                  : IoArrowDownCircleOutline
              }
              color={userVote?.voteValue === -1 ?  "#4379FF" :  "gray.400"}
              fontSize={22}
              cursor="pointer"
              onClick={(event) => onVote(event, -1)}
            />
          </>
        )}
      </Flex>
  )
}

export default VoteComponent