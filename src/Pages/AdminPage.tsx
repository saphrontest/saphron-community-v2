import { IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Text } from '@chakra-ui/react'
import { PlatformAdminPageLayout } from '../Layouts'
import { AdminSupportGroups, AdminTabs, AdminUsers, WorkshopAdmin, AdminPost} from '../Components'

const AdminPage = () => {

    const user: IUser = useSelector((state: RootState) => state.user)

    if (user.role !== 'admin') {
        return <Text>You are not allowed to see here</Text>
    }

    return (
        <PlatformAdminPageLayout title='Dashboard'>
            <AdminTabs
                tabs={[
                    { id: 2, name: 'Users', component: <AdminUsers />},
                    { id: 3, name: 'Posts', component: <AdminPost />},
                    { id: 0, name: 'Workshops', component: <WorkshopAdmin />},
                    { id: 1, name: 'Support Groups', component: <AdminSupportGroups />},
                ]}
            />
        </PlatformAdminPageLayout>
    )
}

export default AdminPage