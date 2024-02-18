import { MenuItem } from "@chakra-ui/react"
import { FC, ReactElement } from "react"

const MenuItemLayout: FC<{ children: ReactElement }> = ({ children }) => {
    return (
        <MenuItem
            fontSize="10pt"
            fontWeight={700}
            _hover={{ bg: "blue.500", color: "white" }}
        >
            {children}
        </MenuItem>

    )
}

export default MenuItemLayout