import { MenuDivider, MenuItem, Flex, Icon, useMediaQuery } from "@chakra-ui/react";
import { FC } from "react";
import { UserRoleTypes } from "../../../../Interface";
import MenuItemInner from "./MenuItemInner";
import MenuItemLayout from "./MenuItemLayout";
import { IconType } from "react-icons";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa";
import { GrGroup, GrWorkshop } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineGroups3, MdOutlineEvent, MdOutlineLogin } from "react-icons/md";
import { PiInfoFill } from "react-icons/pi";

interface IUserMenuItem {
    id: number;
    route: string;
    icon: IconType;
    label: string;
    role: UserRoleTypes[];
}

const UserMenuItems: IUserMenuItem[] = [
    { id: 0, route: "/community/profile", icon: CgProfile, label: "Profile", role: ["user", "admin"] },
    { id: 1, route: "/community/saved-posts", icon: FaRegBookmark, label: "Saved Posts", role: ["user", "admin"] },
    { id: 2, route: "/my-workshops", icon: GrWorkshop, label: "My Workshops", role: ["user", "admin"] },
    { id: 3, route: "/my-support-groups", icon: GrGroup, label: "My Support Groups", role: ["user", "admin"] },
    { id: 4, route: "/manager-dashboard", icon: RiAdminLine, label: "Dashboard", role: ["admin"] }
]

const UserMenuMobileItems: IUserMenuItem[] = [
    { id: 5, route: "/about", icon: PiInfoFill, label: "About Us", role: ["user", "admin"] },
    { id: 6, route: "/support-groups", icon: MdOutlineGroups3, label: "Support Groups", role: ["user", "admin"] },
    { id: 7, route: "/workshops", icon: MdOutlineEvent, label: "Workshops", role: ["user", "admin"] },
]

interface IUserMenuInnerProps {
    logout: () => Promise<void>;
    userRole: UserRoleTypes;
}

const UserMenuInner: FC<IUserMenuInnerProps> = ({ logout, userRole }) => {
    const [isSmallerThan770] = useMediaQuery('(max-width: 770px)')
    return (
        <>
            {
                UserMenuItems.map((item: IUserMenuItem) => item.role.includes(userRole) && (
                    <MenuItemLayout key={item.id}>
                        <MenuItemInner to={item.route} icon={item.icon} label={item.label} />
                    </MenuItemLayout>
                ))
            }
            {isSmallerThan770 && <MenuDivider />}
            {
                isSmallerThan770 && UserMenuMobileItems.map((item: IUserMenuItem) => item.role.includes(userRole) && (
                    <MenuItemLayout key={item.id}>
                        <MenuItemInner to={item.route} icon={item.icon} label={item.label} />
                    </MenuItemLayout>
                ))
            }
            <MenuDivider />
            <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{ bg: "blue.500", color: "white" }}
                onClick={() => logout()}
            >
                <Flex alignItems="center">
                    <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                    Log Out
                </Flex>
            </MenuItem>
        </>
    )
}

export default UserMenuInner