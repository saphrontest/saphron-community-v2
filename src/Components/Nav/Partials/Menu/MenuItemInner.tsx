import { Flex, Icon } from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface IMenuItemInnerProps {
    to: string;
    icon: IconType;
    label: string;
}

const MenuItemInner: FC<IMenuItemInnerProps> = ({ to, icon, label }) => {
    return (
        <Link to={to}>
            <Flex alignItems="center">
                <Icon as={icon} fontSize={20} mr={2} />
                {label}
            </Flex>
        </Link>
    )
}

export default MenuItemInner