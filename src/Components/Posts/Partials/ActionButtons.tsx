import { Flex, Icon, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoBookmarkOutline, IoBookmarkSharp } from 'react-icons/io5'
import { Post } from '../../../Interface/PostInterface'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { auth } from '../../../firebaseClient'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getUserSavedPosts, savePost } from '../../../Helpers/apiFunctions'
import { setModal } from '../../../redux/slices/modalSlice'
import { BsChat } from 'react-icons/bs'

interface ActionButtonsInterface {
    post: Post;
    isSaved: boolean;
    handleDelete: (post: Post) => Promise<boolean>;
    isDeleteLoading: boolean;
}

const ActionButtons :FC<ActionButtonsInterface> = ({post, isSaved, handleDelete, isDeleteLoading}) => {

    const toast = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [user] = useAuthState(auth);

    const [isSaveLoading, setSaveLoading] = useState(false)

    const handleSave = async(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if(!user?.uid){
          toast({
            title: "Please login, first!",
            status: "error",
            isClosable: true,
            position: "top-right"
          })
          dispatch(setModal({isOpen: true, view: 'login'}))
          return;
        }
    
        setSaveLoading(true)
        savePost(post, user?.uid as string)
        .finally(() => {
          getUserSavedPosts(user?.uid as string)
          setSaveLoading(false)
        })
      }
    return (
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
            <Flex
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: "gray.200" }}
                cursor="pointer"
                onClick={() => navigate(`/post/${post.id}`)}
            >
                <Icon as={BsChat} mr={2} />
                <Text fontSize="9pt" textAlign={"left"}>{post.numberOfComments}</Text>
            </Flex>
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
            {user?.uid === post.creatorId && <Flex
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
        </Flex>
    )
}

export default ActionButtons