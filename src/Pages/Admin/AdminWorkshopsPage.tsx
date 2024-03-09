import React from 'react'
import { PlatformAdminPageLayout } from '../../Layouts'
import { WorkshopAdmin } from '../../Components'

const AdminWorkshopsPage = () => {
  return (
    <PlatformAdminPageLayout title='Workshops'>
        <WorkshopAdmin />
    </PlatformAdminPageLayout>
  )
}

export default AdminWorkshopsPage
