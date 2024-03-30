import { IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Box, Flex, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import { PlatformAdminPageLayout } from '../Layouts'
import { useAdmin, usePost, useSupportGroup, useTask, useWorkshop } from '../Hooks'
import { FC, Fragment, useEffect, useState } from 'react'
import uniqid from 'uniqid'

interface IStatItem {
    id: string;
    name: string;
    count: number;
}

const StatItem: FC<{
    item: IStatItem
}> = ({
    item
}) => (
    <Box w="fit-content" bg="gray.100" p="1rem" borderRadius="1rem">
        <Stat>
            <StatLabel textTransform="capitalize">Number of {item.name}</StatLabel>
            <StatNumber>{item.count}</StatNumber>
        </Stat>
    </Box>
)

const AdminPage = () => {

    const { getUsers } = useAdmin()
    const { getPosts } = usePost()
    const { getWorkshops } = useWorkshop()
    const { getSupportGroups } = useSupportGroup()
    const { getTasks } = useTask()

    const [taskCount, setTaskCount] = useState<number>()
    const [userCount, setUserCount] = useState<number>()
    const [postsCount, setPostsCount] = useState<number>()
    const [workshopCount, setWorkshopCount] = useState<number>()
    const [supportGroupCount, setSupportGroupCount] = useState<number>()

    const user: IUser = useSelector((state: RootState) => state.user)

    useEffect(() => {

        getUsers()
            .then(result => setUserCount(result.length))

        getPosts()
            .then(result => setPostsCount(result.length))

        getWorkshops()
            .then(result => setWorkshopCount(result.length))

        getSupportGroups()
            .then(result => setSupportGroupCount(result.length))

        getTasks()
            .then(result => setTaskCount(result.length))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (user.role !== 'admin') {
        return <Text>You are not allowed to see here</Text>
    }

    const STATS: IStatItem[] = [
        {id: uniqid(), name: "workshops", count: workshopCount as number},
        {id: uniqid(), name: "users", count: userCount as number},
        {id: uniqid(), name: "support groups", count: supportGroupCount as number},
        {id: uniqid(), name: "posts", count: postsCount as number},
        {id: uniqid(), name: "tasks", count: taskCount as number}
    ]

    return (
        <PlatformAdminPageLayout title='Dashboard'>
            <Flex mt="1rem" gap="1rem" flexWrap="wrap">
                {STATS.map(item => (
                    <Fragment key={item.id}>
                        <StatItem item={item}/>
                    </Fragment>
                ))}
            </Flex>
        </PlatformAdminPageLayout>
    )
}

export default AdminPage