import { IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Text } from '@chakra-ui/react'
import { PlatformAdminPageLayout } from '../Layouts'
import { AdminSupportGroups, AdminTabs, AdminUsers, WorkshopAdmin } from '../Components'

const AdminPage = () => {

    const user: IUser = useSelector((state: RootState) => state.user)

    if (user.role !== 'admin') {
        return <Text>You are not allowed to see here</Text>
    }

    return (
        <PlatformAdminPageLayout title='Dashboard'>
            <AdminTabs
                tabs={[
                    { id: 0, name: 'Workshop Requests', component: <WorkshopAdmin />},
                    { id: 1, name: 'Support Group Requests', component: <AdminSupportGroups />},
                    { id: 2, name: 'Users', component: <AdminUsers />}
                ]}
            />
        </PlatformAdminPageLayout>
    )
}

export default AdminPage