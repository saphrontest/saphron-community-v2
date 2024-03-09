import React from 'react'
import { PlatformAdminPageLayout } from '../../Layouts'
import { AdminSupportGroups } from '../../Components'

const AdminSupportGroupsPage = () => {
  return (
    <PlatformAdminPageLayout title='Support Groups'>
        <AdminSupportGroups />
    </PlatformAdminPageLayout>
  )
}

export default AdminSupportGroupsPage
