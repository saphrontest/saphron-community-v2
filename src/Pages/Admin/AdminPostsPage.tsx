import React from 'react'
import { PlatformAdminPageLayout } from '../../Layouts'
import { AdminPost } from '../../Components'

const AdminPostsPage = () => {
  return (
    <PlatformAdminPageLayout title='Posts'>
        <AdminPost />
    </PlatformAdminPageLayout>
  )
}

export default AdminPostsPage
