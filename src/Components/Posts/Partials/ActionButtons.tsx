import { Flex, Icon, Spinner, Text, useToast } from '@chakra-ui/react'
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

interface ActionButtonsInterface {
    post: IPost;
    isSaved: boolean;
    handleDelete: (post: IPost) => Promise<boolean>;
    isDeleteLoading: boolean;
}

//TODO: WORK ON POST STATE && SAVED POSTS

const ActionButtons :FC<ActionButtonsInterface> = ({post, isSaved, handleDelete, isDeleteLoading}) => {
    const toast = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {onSave: savePost, getSavedPostsByUser} = usePost()
    const user = useSelector((state: RootState) => state.user)
    const [isSaveLoading, setSaveLoading] = useState(false)

    const handleSave = async(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if(!user?.id){
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
        savePost(post, user.id)
            .finally(() => {
                getSavedPostsByUser(user?.id as string)
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
                onClick={() => navigate(`/community/post/${post.slugId}/${post.slug}`)}
            >
                <Icon as={BsChat} mr={2} />
                <Text fontSize="9pt" textAlign={"left"}>{post.numberOfComments}</Text>
            </Flex>
            {user.id && (
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
            {user?.id === post.creatorId && <Flex
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