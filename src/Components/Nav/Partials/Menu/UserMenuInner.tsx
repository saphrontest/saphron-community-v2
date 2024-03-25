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
import { MdOutlineLogin } from "react-icons/md";
import NavigationMenu from "./NavigationMenu";
import { BsAward } from "react-icons/bs";

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
    { id: 4, route: "/rewards", icon: BsAward, label: "Rewards", role: ["user", "admin"] },
    { id: 5, route: "/manager-dashboard", icon: RiAdminLine, label: "Dashboard", role: ["admin"] }
]

interface IUserMenuInnerProps {
    logout: () => Promise<void>;
    userRole: UserRoleTypes;
    activePath: string;
}

const UserMenuInner: FC<IUserMenuInnerProps> = ({ logout, userRole, activePath }) => {
    const [isSmallerThan770] = useMediaQuery('(max-width: 770px)')
    return (
        <>
            {
                UserMenuItems.map((item: IUserMenuItem) => item.role.includes(userRole) && (
                    <MenuItemLayout key={item.id} to={item.route} isActive={activePath === item.route}>
                        <MenuItemInner icon={item.icon} label={item.label}/>
                    </MenuItemLayout>
                ))
            }
            { isSmallerThan770 && <MenuDivider /> }
            { isSmallerThan770 && <NavigationMenu userRole={userRole} activePath={activePath}/> }
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