import React, { FC } from 'react'
import { IconType } from 'react-icons';
import { MdOutlineGroups3, MdOutlineEvent } from 'react-icons/md';
import { PiInfoFill } from 'react-icons/pi';
import { UserRoleTypes } from '../../../../Interface';
import MenuItemInner from './MenuItemInner';
import MenuItemLayout from './MenuItemLayout';


interface IUserMenuItem {
  id: number;
  route: string;
  icon: IconType;
  label: string;
  role: UserRoleTypes[];
}


const NavMenuItems: IUserMenuItem[] = [
  { id: 5, route: "/about", icon: PiInfoFill, label: "About Us", role: ["user", "admin"] },
  { id: 6, route: "/support-groups", icon: MdOutlineGroups3, label: "Support Groups", role: ["user", "admin"] },
  { id: 7, route: "/workshops", icon: MdOutlineEvent, label: "Workshops", role: ["user", "admin"] },
]

const NavigationMenu: FC<{ userRole: UserRoleTypes; }> = ({ userRole }) => {
  return (
    <>
      {
        NavMenuItems.map((item: IUserMenuItem) => item.role.includes(userRole) && (
          <MenuItemLayout key={item.id}>
            <MenuItemInner to={item.route} icon={item.icon} label={item.label} />
          </MenuItemLayout>
        ))
      }
    </>
  )
}

export default NavigationMenu
