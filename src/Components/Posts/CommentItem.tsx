import { FC } from 'react'
import { Comment } from '../../Interface/CommentsInterface'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseClient';
import { Box, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from 'react-icons/io5';

interface CommentItemProps {
    comment: Comment;
    onDelete: (comment: Comment) => void;
    isLoading: boolean;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onDelete, isLoading }) => {
    const [user] = useAuthState(auth);
    return (
        <Flex>
            <Box mr={2}>
                {/* <Avatar boxSize={8} /> */}

            </Box>
            <Stack spacing={1}>
                <Stack direction="row" align="center" spacing={2} fontSize="8pt">
                    <Text
                        fontWeight={700}
                        _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                        {comment?.creatorDisplayText}
                    </Text>
                    {comment?.createdAt?.seconds && (
                        <Text color="gray.600">
                            {moment(new Date(comment?.createdAt?.seconds * 1000)).fromNow()}
                        </Text>
                    )}
                    {isLoading && <Spinner size="sm" />}
                </Stack>
                <Text fontSize="10pt" textAlign={"left"}>{comment?.text}</Text>
                <Stack
                    direction="row"
                    align="center"
                    cursor="pointer"
                    fontWeight={600}
                    color="gray.500"
                >
                    <Icon as={IoArrowUpCircleOutline} />
                    <Icon as={IoArrowDownCircleOutline} />
                    {user?.uid === comment?.creatorId && (
                        <>
                            <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                                Edit
                            </Text>
                            <Text
                                fontSize="9pt"
                                _hover={{ color: "blue.500" }}
                                onClick={() => onDelete(comment)}
                            >
                                Delete
                            </Text>
                        </>
                    )}
                </Stack>
            </Stack>
        </Flex>
    );
}

export default CommentItem