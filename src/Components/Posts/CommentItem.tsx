import { FC, useEffect, useState } from 'react'
import { Comment, CommentVote as CommentVoteInterface } from '../../Interface/CommentsInterface'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebaseClient';
import { Avatar, Box, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { collection, doc, increment, writeBatch } from 'firebase/firestore';
import { getCommentVotesByUserId } from '../../Helpers/apiFunctions';
import CommentVote from './CommentVote';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';

interface CommentItemProps {
    comment: Comment;
    onDelete: (commentId: string, postId: string) => void;
    isLoading: boolean;
    getComments: (id: string) => void
}

const CommentItem: FC<CommentItemProps> = ({ comment, onDelete, isLoading, getComments }) => {
    const dispatch = useDispatch()
    const [user] = useAuthState(auth);
    const [voteLoading, setVoteLoading] = useState<boolean>(false)
    const [userVote, setUserVote] = useState<CommentVoteInterface>(null)


    useEffect(() => {
        user?.uid && getUserVote(user.uid)
    }, [user?.uid])

    const getUserVote = async (userId: string) => {
        setVoteLoading(true)
        try {
            const votes = await getCommentVotesByUserId(userId)
            setUserVote(votes.find(vote => vote?.creatorId === userId) || null)
        } finally {
            setVoteLoading(false)
        }
    }

    const onVote = async (value: number, userId: string) => {
        if (!!userId === false) {
            dispatch(setModal({ isOpen: true, view: 'login' }))
            return;
        }

        const createCommentVote = async (userId: string) => {
            // ADD COMMENT VOTE VALUE TO COMMENT ITEM
            const batch = writeBatch(firestore);
            const commentVote: CommentVoteInterface = {
                creatorId: userId,
                postId: comment?.postId,
                commentId: comment?.id,
                value: value
            }
            const commentVoteRef = doc(collection(firestore, "users", userId, "commentVotes"));
            commentVote.id = commentVoteRef.id;
            batch.set(commentVoteRef, commentVote);
            await batch.commit();
        }

        const addCommentVoteValue = async () => {
            // ADD COMMENT VOTE VALUE TO COMMENT ITEM
            const batch = writeBatch(firestore);
            const commentRef = doc(firestore, "comments", comment?.id as string);
            batch.update(commentRef, { voteValue: increment(value === userVote?.value ? -1 * value : value) });
            await batch.commit();
        }

        const updateCommentVoteValue = async (userId: string) => {
            // UPDATE COMMENT ITEM VOTE VALUE
            const batch = writeBatch(firestore);
            const commentVoteRef = doc(firestore, "users", `${userId}/commentVotes/${userVote?.id}`);
            if(value === userVote?.value) {
                batch.delete(commentVoteRef);
            } else {
                batch.update(commentVoteRef, { value: value });
            }
            await batch.commit();
        }


        try {
            if (!!userVote) {
                updateCommentVoteValue(userId)
            } else {
                createCommentVote(userId)
            }
            addCommentVoteValue()

        } finally {
            getComments(comment?.postId as string)
            getUserVote(userId)
        }
        


    }

    return (
        <Flex>
            <Box mr={2}>
                <Avatar src={comment?.creatorPhotoURL} />
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
                    {
                        voteLoading ? <Spinner size="sm" /> : 
                            <CommentVote
                            userId={user?.uid as string}
                            userVote={userVote}
                            onVote={onVote}
                            voteValue={comment?.voteValue as number} />
                    }
                    {user?.uid === comment?.creatorId && (
                        <Text
                            fontSize="9pt"
                            _hover={{ color: "blue.500" }}
                            onClick={() => onDelete(comment?.id as string, comment?.postId as string)}
                        >
                            Delete
                        </Text>
                    )}
                </Stack>
            </Stack>
        </Flex>
    );
}

export default CommentItem