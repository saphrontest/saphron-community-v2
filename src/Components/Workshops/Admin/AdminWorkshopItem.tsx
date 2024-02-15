import { FC } from 'react'
import { Workshop } from '../../../Interface/WorkshopInterface'
import { AdminItem, AdminStatusSelect } from '../../Platform'

const AdminWorkshopItem: FC<{
  idx: number;
  workshop: Workshop;
  onSelect: (worksopId: string, optionId: number) => Promise<Boolean>
}> = ({workshop, idx, onSelect}) => {
  return (
      <AdminItem
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
      </AdminItem>
  )
}

export default AdminWorkshopItem