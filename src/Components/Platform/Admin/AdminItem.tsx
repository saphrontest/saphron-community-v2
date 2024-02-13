import { Flex, Divider, Text, Image, Box } from '@chakra-ui/react'
import moment from 'moment'
import React, { FC, ReactNode } from 'react'

interface IAdminItemProps {
    idx: number;
    coverImg: string;
    name: string;
    createdAt: string;
    userAvatar: string;
    userId: string;
    userName: string;
    userEmail: string;
    children: ReactNode
}

const AdminItem: FC<IAdminItemProps> = ({
    idx, coverImg, name, userAvatar, createdAt, userId, userName, userEmail, children
}) => {
    return (
        <Flex direction="row" justify="space-between" align="center" p="1rem" bg="gray.50" borderRadius="1rem">
            <Flex direction="row" align="center" h="100%" gap="1rem" w="100%">
                <Flex align="center" h="100%" w="40%">
                    <Text fontWeight={600} mr="1rem">#{idx + 1}</Text>
                    <Image src={coverImg} w="7rem" h="5rem" mr="1rem" borderRadius="1rem" />
                    <Box>
                        <Text textAlign="left" fontWeight="600" fontSize="18" noOfLines={2}>{name}</Text>
                        <Text textAlign="left">{moment(new Date(createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
                    </Box>
                </Flex>
                <Divider orientation='vertical' borderColor="gray" h="100%" />
                <Flex direction="row" gap="0.5rem">
                    <Image src={userAvatar} width="32px" height="32px" borderRadius={999} />
                    <Flex gap="0.3rem" align="flex-start" justify="center" direction="column">
                        <Text textAlign="left" color="gray" fontSize={12} fontStyle="italic">#{userId}</Text>
                        <Text textAlign="left">{userName}</Text>
                        <Text textAlign="left">{userEmail}</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Box>
                {children}
            </Box>
        </Flex>
    )
}

export default AdminItem