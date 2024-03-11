import { Box, Divider, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react'
import { FC, useState } from 'react'
import CommentItem from './CommentItem';
import { Comment, IPost } from '../../Interface';
import { CommentInput } from './Partials';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import { RootState } from '../../redux/store';
import { useComment } from '../../Hooks';

interface CommentsProps {
    comments: (Comment | null)[];
    post: IPost;
    getComments: (id: string) => void
}

const Comments: FC<CommentsProps> = ({ comments, post, getComments }) => {

    const dispatch = useDispatch()
    const { onCreate: createComment, onDelete: deleteComment } = useComment()
    const user = useSelector((state: RootState) => state.user)
    const [deleteLoading, setDeleteLoading] = useState("");
    const [comment, setComment] = useState<string>("");
    const [commentCreateLoading, setCommentCreateLoading] = useState<boolean>(false);
    const commentArray = comments as Comment[];

    const onCommentDelete = async (commentId: string, postId: string) => {
        setDeleteLoading(commentId)
        try {
            await deleteComment(commentId, postId)
        } catch (error: any) {
            console.log("ERROR deleting comment: " + error.message)
        } finally {
            getComments(post.id)
            setDeleteLoading(commentId)
        }
    }

    const checkUser = () => {
        if (!user) {
            dispatch(setModal({ isOpen: true, view: "login" }));
            return;
        }
    }

    const onCreateComment = async (comment: string) => {
        checkUser()
        setCommentCreateLoading(true);
        try {
            await createComment(post, user, comment)
            getComments(post.id)
            setComment("")
        } catch (error: any) {
            console.log("onCreateComment error", error.message);
        } finally {
            setCommentCreateLoading(false);
        }
    }

    return (
        <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
            <Flex
                direction="column"
                fontSize="10pt"
                width="100%"
            >
                <CommentInput
                    comment={comment}
                    setComment={setComment}
                    loading={commentCreateLoading}
                    user={user}
                    onCreateComment={onCreateComment}
                />
            </Flex>
            <Stack spacing={6} p={2}>
                {comments === null ? (
                    <>
                        {[0, 1, 2].map((item) => (
                            <Box key={item} padding="6" bg="white">
                                <SkeletonCircle size="10" />
                                <SkeletonText mt="4" noOfLines={2} spacing="4" />
                            </Box>
                        ))}
                    </>
                ) : (
                    <>
                        {commentArray.length > 0 ? (
                            <>
                                <Divider borderColor="gray.200" />
                                {commentArray.map((item: Comment) => (
                                    <CommentItem
                                        key={item?.id}
                                        comment={item}
                                        onDelete={onCommentDelete}
                                        isLoading={deleteLoading === (item?.id as string)}
                                        getComments={getComments}
                                    />
                                ))}
                            </>
                        ) : (
                            <Flex
                                direction="column"
                                justify="center"
                                align="center"
                                borderTop="1px solid"
                                borderColor="gray.100"
                                p={20}
                            >
                                <Text fontWeight={700} opacity={0.3}>
                                    No Comments Yet
                                </Text>
                            </Flex>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    )
}

export default Comments