import { FC, useEffect, useState } from 'react'
import { Comment, CommentVote } from '../../Interface/CommentsInterface'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebaseClient';
import { Avatar, Box, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from 'react-icons/io5';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';

interface CommentItemProps {
    comment: Comment;
    onDelete: (comment: Comment) => void;
    isLoading: boolean;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onDelete, isLoading }) => {
    const [user] = useAuthState(auth);
    const [commentVotes, setCommentVotes] = useState<CommentVote[]>([])

    useEffect(() => {
        user?.uid && getCommentVotes(user.uid)
    }, [user?.uid])

    const getCommentVotes = (userId: string) => {
        const commentVotesRef = doc(collection(firestore, "users", userId, "commentVotes"));
        getDoc(commentVotesRef)
            .then((doc) => {
                console.log(doc)
                if (doc.exists()) {
                    const data = doc.data();
                    const votes: CommentVote[] = []
                    data.forEach((element: any) => {
                        const item = {id: element?.id , ...element?.data()} as CommentVote
                        votes.push(item);
                    }).finally(() => setCommentVotes(votes));
                    console.log("comment votes:", data);
                }else{
                    console.log("comment votes not exist");
                }
            })
    }
    
    
    const onVote = async (value: number, userId: string) => {
        
        

        const addCommentVote = async (userId: string) => {
            const batch = writeBatch(firestore);
            const commentVote: CommentVote = {
                creatorId: userId,
                postId: comment?.postId,
                commentId: comment?.id,
                value: value
            }

            const commentVoteRef = doc(collection(firestore, "users", userId, "commentVotes"));
            commentVote.id= commentVoteRef.id;
            batch.set(commentVoteRef, commentVote)
            await batch.commit();
        }
            
        

    }

    return (
        <Flex>
            <Box mr={2}>
                {/* <Avatar boxSize={8} /> */}
                <Avatar src={comment?.creatorPhotoURL}/>
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
                    <Icon as={IoArrowUpCircleOutline} onClick={(e) => user?.uid && onVote(1, user?.uid)}/>
                    <Icon as={IoArrowDownCircleOutline} onClick={(e) => user?.uid && onVote(-1, user?.uid)}/>
                    {user?.uid === comment?.creatorId && (
                            <Text
                                fontSize="9pt"
                                _hover={{ color: "blue.500" }}
                                onClick={() => onDelete(comment)}
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