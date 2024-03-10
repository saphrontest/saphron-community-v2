import { IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Box, Flex, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import { PlatformAdminPageLayout } from '../Layouts'
import { useAdmin, usePost, useSupportGroup, useWorkshop } from '../Hooks'
import { useEffect, useState } from 'react'

const AdminPage = () => {

    const { getUsers } = useAdmin()
    const { getPosts } = usePost()
    const { getWorkshops } = useWorkshop()
    const { getSupportGroups } = useSupportGroup()

    const [userCount, setUserCount] = useState<number>()
    const [postsCount, setPostsCount] = useState<number>()
    const [workshopCount, setWorkshopCount] = useState<number>()
    const [supportGroupCount, setSupportGroupCount] = useState<number>()

    const user: IUser = useSelector((state: RootState) => state.user)

    useEffect(() => {
        getUsers().then(result => setUserCount(result.length))
        getPosts().then(result => setPostsCount(result.length))
        getWorkshops().then(result => setWorkshopCount(result.length))
        getSupportGroups().then(result => setSupportGroupCount(result.length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (user.role !== 'admin') {
        return <Text>You are not allowed to see here</Text>
    }

    return (
        <PlatformAdminPageLayout title='Dashboard'>
            <Flex mt="1rem" gap="1rem" flexWrap="wrap">
                <Box w="fit-content" bg="gray.100" p="1rem" borderRadius="1rem">
                    <Stat>
                        <StatLabel>Number of Users</StatLabel>
                        <StatNumber>{userCount}</StatNumber>
                    </Stat>
                </Box>
                <Box w="fit-content" bg="gray.100" p="1rem" borderRadius="1rem">
                    <Stat>
                        <StatLabel>Number of Workshops</StatLabel>
                        <StatNumber>{workshopCount}</StatNumber>
                    </Stat>
                </Box>
                <Box w="fit-content" bg="gray.100" p="1rem" borderRadius="1rem">
                    <Stat>
                        <StatLabel>Number of Support Groups</StatLabel>
                        <StatNumber>{supportGroupCount}</StatNumber>
                    </Stat>
                </Box>
                <Box w="fit-content" bg="gray.100" p="1rem" borderRadius="1rem">
                    <Stat>
                        <StatLabel>Number of Posts</StatLabel>
                        <StatNumber>{postsCount}</StatNumber>
                    </Stat>
                </Box>
            </Flex>
        </PlatformAdminPageLayout>
    )
}

export default AdminPage