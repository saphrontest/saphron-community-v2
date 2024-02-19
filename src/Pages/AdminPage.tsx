import { UserInterface } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Text } from '@chakra-ui/react'
import { PlatformAdminPageLayout } from '../Layouts'
import { AdminSupportGroups, AdminTabs, WorkshopAdmin } from '../Components'

const AdminPage = () => {

    const user: UserInterface = useSelector((state: RootState) => state.user)

    if (user.role !== 'admin') {
        return <Text>You are not allowed to see here</Text>
    }

    return (
        <PlatformAdminPageLayout title='Dashboard'>
            <AdminTabs
                tabs={[
                    { id: 0, name: 'Workshop Requests', component: <WorkshopAdmin />},
                    { id: 1, name: 'Support Group Requests', component: <AdminSupportGroups />}
                ]}
            />
        </PlatformAdminPageLayout>
    )
}

export default AdminPage