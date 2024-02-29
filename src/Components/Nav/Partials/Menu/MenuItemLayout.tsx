import { MenuItem } from "@chakra-ui/react"
import { FC, ReactElement } from "react"
import { Link } from "react-router-dom";

const MenuItemLayout: FC<{ children: ReactElement, isActive: boolean, to: string; }> = ({ children, isActive, to }) => {
    return (
        <Link to={to}>
            <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{ bg: "blue.500", color: "white" }}
                bg={isActive ? "gray.100" : "white"}
            >
                {children}
            </MenuItem>
        </Link>
    )
}

export default MenuItemLayout