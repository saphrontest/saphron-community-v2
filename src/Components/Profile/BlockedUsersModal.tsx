import { ModalHeader, ModalCloseButton, ModalBody, Flex, useBoolean, Text, Button, Spinner, Center } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { ModalLayout } from '../../Layouts'
import { getBlockedUsersByUserId, getUser as getUserById } from '../../Helpers';
import { IBlockedUser, IUser } from '../../Interface';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';
import { Transaction, doc, runTransaction } from 'firebase/firestore';
import { firestore } from '../../firebaseClient';
import NoEntry from '../NoEntry';

type IBlockedUserTemp = IUser & { blockedDate: string; blockedItemId: string; }

const BlockedUsersModal: FC<{ isOpen: boolean; toggleModal: () => void; }> = ({ isOpen, toggleModal }) => {

    const [blockedUsers, setBlockedUsers] = useState<IBlockedUserTemp[]>([])
    const [loading, { toggle: toggleLoading }] = useBoolean(false)
    const user: IUser = useSelector((state: RootState) => state.user)

    const getBlockedUsers = async () => {
        setBlockedUsers([])
        return getBlockedUsersByUserId(user.id)
                .then(blockedUsersData => {
                    blockedUsersData.forEach(async (blocked: IBlockedUser) => {
                        const userData = await getUserById(blocked.userId, 'query')
                        setBlockedUsers(prev => {
                            if(!prev.find(item => item.id === userData?.id)){
                                return [{ id: blocked.userId, blockedDate: blocked.date, blockedItemId: blocked.id, ...userData } as IBlockedUserTemp, ...prev]
                            }
                            return [...prev]
                        })
                    })
                })
    }

    useEffect(() => {
        if (isOpen) {
            toggleLoading()
            getBlockedUsers()
                .finally(() => toggleLoading())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const unblockUser = async (blockedItemId: string) => {
        try {
            runTransaction(firestore, async (transaction: Transaction) => {
                transaction.delete(doc(firestore, `users/${user.id}/blockedUsers/${blockedItemId}`))
            }).then(() => {
                toggleLoading()
                getBlockedUsers()
                    .finally(() => toggleLoading())
            })
        } catch (error) {
            
        }
    }

    return (
        <ModalLayout size='xl' isCentered={false} isOpen={isOpen} onClose={toggleModal}>
            <ModalHeader
                display="flex"
                flexDirection="row"
                fontSize={22}
                padding={3}
            >
                Blocked Users
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                pb={6}
            >
                <Flex
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="center"
                    gap="1rem"
                    h="100%"
                    w="100%"
                >
                    {!blockedUsers.length && <NoEntry type="blocked user"/>}
                    {
                        !loading ? blockedUsers.map((user: IBlockedUserTemp) => (
                            <Flex
                            key={user.id}
                            w="100%"
                            p="1rem"
                            bg="gray.100"
                            borderRadius="0.4rem"
                            direction="column"
                            gap="1rem"
                            >
                                <Flex
                                    direction="row"
                                    justify="space-between"
                                >
                                    <Flex direction="column">
                                        <Text color="gray" fontSize="12px">#{user.id}</Text>
                                        <Flex gap="0.3rem" align="center">
                                            <Text fontWeight={700}>{user.displayName}</Text>
                                            <Text fontSize="14px">@{user.username}</Text>
                                        </Flex>
                                    </Flex>
                                    <Flex direction="column" align="flex-end">
                                        <Text fontWeight={700}>Blocking Date</Text>
                                        <Text>{moment(user.blockedDate).fromNow()}</Text>
                                    </Flex>
                                </Flex>
                                <Button variant="outline" onClick={() => unblockUser(user.blockedItemId)}>Unblock</Button>
                            </Flex>
                        )) : (
                            <Center w="100%">
                                <Spinner size="xl"/>
                            </Center>
                        )
                    }
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default BlockedUsersModal
