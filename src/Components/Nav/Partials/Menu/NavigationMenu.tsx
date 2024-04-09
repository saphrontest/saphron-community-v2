import React, { FC } from 'react'
import { IconType } from 'react-icons';
import { MdOutlineGroups3, MdOutlineEvent } from 'react-icons/md';
import { PiInfoFill } from 'react-icons/pi';
import { UserRoleTypes } from '../../../../Interface';
import MenuItemInner from './MenuItemInner';
import MenuItemLayout from './MenuItemLayout';
import { GoHome, GoTasklist } from "react-icons/go";
import { FaStore } from "react-icons/fa";

interface IUserMenuItem {
  id: number;
  route: string;
  icon: IconType;
  label: string;
  role: UserRoleTypes[];
}


const NavMenuItems: IUserMenuItem[] = [
  { id: 5, route: "/", icon: GoHome, label: "Home", role: ["user", "admin"] },
  { id: 6, route: "/about", icon: PiInfoFill, label: "About Us", role: ["user", "admin"] },
  { id: 7, route: "/support-groups", icon: MdOutlineGroups3, label: "Support Groups", role: ["user", "admin"] },
  { id: 8, route: "/workshops", icon: MdOutlineEvent, label: "Workshops", role: ["user", "admin"] },
  { id: 9, route: "/marketplace", icon: FaStore, label: "Marketplace", role: ["user", "admin"] },
  { id: 10, route: "/task-tracker", icon: GoTasklist, label: "Task Tracker", role: ["user", "admin"] },
]

const NavigationMenu: FC<{ userRole: UserRoleTypes; activePath: string; }> = ({ userRole, activePath }) => {
  return (
    <>
      {
        NavMenuItems.map((item: IUserMenuItem) => item.role.includes(userRole) && (
          <MenuItemLayout to={item.route} key={item.id} isActive={item.route === activePath}>
            <MenuItemInner icon={item.icon} label={item.label} />
          </MenuItemLayout>
        ))
      }
    </>
  )
}

export default NavigationMenu
