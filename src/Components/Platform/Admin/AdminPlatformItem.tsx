import { Flex, Divider, Text, Image, Box } from '@chakra-ui/react'
import moment from 'moment'
import React, { FC, ReactNode } from 'react'

interface IAdminPlatformItemProps {
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

const AdminPlatformItem: FC<IAdminPlatformItemProps> = ({
    idx,
    coverImg,
    name,
    userAvatar,
    createdAt,
    userId,
    userName,
    userEmail,
    children
}) => {
    return (
        <Flex direction={{base: "column", md: "row"}} justify="space-between" align={{base: "flex-start", md: "center"}} p="1rem" bg="gray.50" borderRadius="1rem" gap={{base: "1rem", md: "0"}}>
            <Flex direction={{base: "column", md: "row"}} align={{base: "flex-start", md: "center"}} h="100%" gap="1rem" w="100%">
                <Flex align="center" h="100%" w={{base: "100%", md: "40%"}}>
                    <Text fontWeight={600} mr="1rem">#{idx + 1}</Text>
                    <Image src={coverImg} w={{base:"3rem", md: "7rem"}} h={{base: "2rem", md: "5rem"}} mr="1rem" borderRadius={{base: "0.2rem", md: "1rem"}} />
                    <Box>
                        <Text textAlign="left" fontWeight="600" fontSize="18" noOfLines={2}>{name}</Text>
                        <Text textAlign="left">{moment(new Date(createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
                    </Box>
                </Flex>
                <Divider display={{base: "block", md: "none"}}/>
                <Flex direction="row" gap="0.8rem" align="center" pl={{base: "2em", md: 0}}>
                    <Image src={userAvatar} width="32px" height="32px" borderRadius={999} />
                    <Flex gap="0.1rem" align="flex-start" justify="center" direction="column">
                        <Text textAlign="left" color="gray" fontSize={12} fontStyle="italic">#{userId}</Text>
                        <Text textAlign="left" fontWeight={600}>{userName}</Text>
                        <Text textAlign="left">{userEmail}</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Divider display={{base: "block", md: "none"}}/>
            <Box>
                {children}
            </Box>
        </Flex>
    )
}

export default AdminPlatformItem