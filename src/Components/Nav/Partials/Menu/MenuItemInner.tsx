import { Flex, Icon } from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";
interface IMenuItemInnerProps {
    icon: IconType;
    label: string;
}

const MenuItemInner: FC<IMenuItemInnerProps> = ({ icon, label }) => {
    return (
        <Flex alignItems="center">
            <Icon as={icon} fontSize={20} mr={2} />
            {label}
        </Flex>
    )
}

export default MenuItemInner