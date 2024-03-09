import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Icon, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoBookmarkOutline, IoBookmarkSharp } from 'react-icons/io5'
import { IPost } from '../../../Interface'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSavedPosts, } from '../../../Helpers/apiFunctions'
import { setModal } from '../../../redux/slices/modalSlice'
import { BsChat } from 'react-icons/bs'
import { RootState } from '../../../redux/store'
import { usePost } from '../../../Hooks'
import { MdBlock } from "react-icons/md";
import { Transaction, collection, doc, runTransaction } from 'firebase/firestore'
import { firestore } from '../../../firebaseClient'
import moment from 'moment'

interface ActionButtonsInterface {
    post: IPost;
    isSaved: boolean;
    handleDelete: (post: IPost) => Promise<boolean>;
    isDeleteLoading: boolean;
    isDashboard?: boolean;
}

const BlockUserAlert: FC<{
    username: string;
    onClose: () => void;
    isOpen: boolean;
    confirmAction: () => void;
}> = ({
    username, onClose, isOpen, confirmAction
}) => {

    const cancelRef = React.useRef(null)

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Block {username}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure that you want to block {username}?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button bg="white" color="blue.500" border="1px solid" borderColor="blue.500" _hover={{color: 'white', background: 'blue.500'}} onClick={() => {
                            onClose()
                            confirmAction()
                        }} ml={3}
                        >
                            Block
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

const ActionButtons: FC<ActionButtonsInterface> = ({ post, isSaved, handleDelete, isDeleteLoading, isDashboard = false }) => {

    const toast = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { onSave: savePost } = usePost()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useSelector((state: RootState) => state.user)
    const [isSaveLoading, setSaveLoading] = useState(false)

    const handleSave = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!user?.id) {
            toast({
                title: "Please login, first!",
                status: "error",
                isClosable: true,
                position: "top-right"
            })
            dispatch(setModal({ isOpen: true, view: 'login' }))
            return;
        }

        setSaveLoading(true)
        savePost(post, user.id)
            .finally(() => {
                getUserSavedPosts(user?.id as string)
                setSaveLoading(false)
            })
    }

    const handleBlockUser = async (userId: string) => {
        const userDoc = doc(collection(firestore, `users/${user.id}/blockedUsers`))
        await runTransaction(firestore, async (tx: Transaction) => {
            tx.set(userDoc, { userId, date: moment().toString() })
        })
    }

    return (
        <>
            <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
                {!isDashboard && <Flex
                    align="center"
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                    cursor="pointer"
                    onClick={() => navigate(`/community/post/${post.slugId}/${post.slug}`)}
                >
                    <Icon as={BsChat} mr={2} />
                    <Text fontSize="9pt" textAlign={"left"}>{post.numberOfComments}</Text>
                </Flex>}
                {(user.id && !isDashboard) && (
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                        onClick={handleSave}
                    >
                        {isSaveLoading ? <Spinner size="sm" /> : (
                            <>
                                <Icon as={isSaved ? IoBookmarkSharp : IoBookmarkOutline} mr={2} />
                                <Text fontSize="9pt">Save</Text>
                            </>
                        )}
                    </Flex>
                )}
                {(isDashboard || user?.id === post.creatorId) && <Flex
                    align="center"
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{ bg: "gray.200" }}
                    cursor="pointer"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        handleDelete(post)
                    }}
                >
                    {isDeleteLoading ? <Spinner size="sm" /> : (
                        <>
                            <Icon as={AiOutlineDelete} mr={2} />
                            <Text fontSize="9pt">Delete</Text>
                        </>
                    )}
                </Flex>}
                {(!isDashboard && user?.id !== post.creatorId) && (
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            onOpen()
                        }}
                    >
                        <Icon as={MdBlock} mr={2} />
                        <Text fontSize="9pt">Block</Text>
                    </Flex>
                )}
            </Flex>
            <BlockUserAlert
            isOpen={isOpen}
            onClose={onClose}
            confirmAction={() => handleBlockUser(post.creatorId)}
            username={post.userDisplayText}
            />
        </>
    )
}

export default ActionButtons