import React from 'react'
import { PlatformAdminPageLayout } from '../../Layouts'
import { AdminUsers } from '../../Components'

const AdminUsersPage = () => {
  return (
    <PlatformAdminPageLayout title='Users'>
        <AdminUsers />
    </PlatformAdminPageLayout>
  )
}

export default AdminUsersPage
