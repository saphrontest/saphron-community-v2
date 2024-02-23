import { FC } from 'react'
import { Workshop } from '../../../Interface'
import { AdminPlatformItem, AdminStatusSelect } from '../../Platform'

const AdminWorkshopItem: FC<{
  idx: number;
  workshop: Workshop;
  onSelect: (worksopId: string, optionId: number) => Promise<boolean>
}> = ({
  idx,
  onSelect,
  workshop
}) => {
  return (
      <AdminPlatformItem
      idx={idx}
      coverImg={workshop.cover_img}
      name={workshop.workshop_name}
      createdAt={workshop.createdAt}
      userAvatar={workshop.workshop_manager_avatar} 
      userId={workshop.workshop_manager_id}
      userName={workshop.workshop_manager_name}
      userEmail={workshop.workshop_manager_mail}
      >
        <AdminStatusSelect onSelect={onSelect} item={workshop} />
      </AdminPlatformItem>
  )
}

export default AdminWorkshopItem