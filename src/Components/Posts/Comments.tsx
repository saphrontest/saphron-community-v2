import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react'
import { FC, useState } from 'react'
import CommentItem from './CommentItem';
import { Comment, IPost } from '../../Interface';
import { firestore } from '../../firebaseClient';
import { CommentInput } from './Partials';
import { collection, collectionGroup, deleteDoc, doc, getDocs, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import { RootState } from '../../redux/store';

interface CommentsProps {
    comments: (Comment | null)[];
    post: IPost;
    getComments: (id: string) => void
}

const Comments: FC <CommentsProps> = ({comments, post, getComments}) => {

    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const [deleteLoading, setDeleteLoading] = useState("");
    const [comment, setComment] = useState<string>("");
    const [commentCreateLoading, setCommentCreateLoading] = useState<boolean>(false);
    const commentArray = comments as Comment[];
    
    const onCommentDelete = async (commentId: string, postId: string) => {
        setDeleteLoading(commentId)
        try {
            // delete the comment
            const commentRef = doc(firestore, "comments", commentId)
            await deleteDoc(commentRef);

            // delete the comment votes for all users which is voted for the comment
            const commentVotesRef = collectionGroup(firestore, "commentVotes")
            const commentDocs = await getDocs(commentVotesRef)
            commentDocs.forEach(async doc => {
                if(doc.data().commentId === commentId){
                    await deleteDoc(doc.ref);
                }
            })

            // update the numberOfComments for the post
            const batch = writeBatch(firestore)
            const postRef = doc(firestore, "posts", postId)
            batch.update(postRef, {
                numberOfComments: increment(-1)
            })
            batch.commit()
            

        } catch (error: any) {
            console.log("ERROR deleting comment: " + error.message)
        } finally {
            getComments(post.id)
            setDeleteLoading(commentId)
        }

        
        
    }

    const onCreateComment = async (comment: string) => {
        if (!user) {
            dispatch(setModal({ isOpen: true, view: "login" }));
            return;
          }
      
          setCommentCreateLoading(true);
          try {
            const batch = writeBatch(firestore);

            // Create comment document
            const commentDocRef = doc(collection(firestore, "comments"));
            batch.set(commentDocRef, {
              postId: post.id,
              creatorId: user.id,
              creatorDisplayText: user.email!.split("@")[0],
              creatorPhotoURL: user.profilePhotoURL,
              text: comment,
              postTitle: post.title,
              createdAt: serverTimestamp(),
              voteValue: 0
            } as Comment);
      
            // Update post numberOfComments
            batch.update(doc(firestore, "posts", post.id), {
              numberOfComments: increment(1),
            });
            await batch.commit();
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
                pl={10}
                pr={4}
                mb={6}
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