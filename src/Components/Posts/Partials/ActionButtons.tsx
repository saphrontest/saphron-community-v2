import { Flex, Icon, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoBookmarkOutline, IoBookmarkSharp } from 'react-icons/io5'
import { IPost } from '../../../Interface'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../../../redux/slices/modalSlice'
import { BsChat } from 'react-icons/bs'
import { RootState } from '../../../redux/store'
import { usePost } from '../../../Hooks'
import { MdBlock } from "react-icons/md";
import { Transaction, collection, doc, runTransaction } from 'firebase/firestore'
import { firestore } from '../../../firebaseClient'
import moment from 'moment'
import BlockUserAlert from '../../BlockUserAlert'

interface ActionButtonsInterface {
    post: IPost;
    isSaved: boolean;
    handleDelete: (post: IPost) => Promise<boolean>;
    isDeleteLoading: boolean;
    isDashboard?: boolean;
    setReloadPost: (arg: boolean) => void;
}

const ActionButtons: FC<ActionButtonsInterface> = ({ post, isSaved, handleDelete, isDeleteLoading, isDashboard = false, setReloadPost }) => {

    const toast = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {onSave: savePost, getSavedPostsByUser} = usePost()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isSaveLoading, setSaveLoading] = useState(false)
    const user = useSelector((state: RootState) => state.user)

    const handleSave = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if(!user?.id){
          toast({
            title: "Please login, first!",
            status: "error",
            isClosable: true
          })
          dispatch(setModal({isOpen: true, view: 'login'}))
          return;
        }

        setSaveLoading(true)
        savePost(post, user.id)
            .finally(() => {
                getSavedPostsByUser(user?.id as string)
                setSaveLoading(false)
            })
    }

    const handleBlockUser = async (userId: string) => {
        const userDoc = doc(collection(firestore, `users/${user.id}/blockedUsers`))
        await runTransaction(firestore, async (tx: Transaction) => {
            tx.set(userDoc, { userId, date: moment().toString() })
        })
        setReloadPost(true)
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
                    onClick={() => navigate(`/community/post/${post.slugId}/${post.slug}`, { state: { isSaved } })}
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