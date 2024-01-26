//Chakra & React
import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { SearchInput, AskButton, AuthButtons, NavLogo, UserMenu } from "./Partials";
import { CommunitySelect } from "../Community";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Nav = () => {
  const [dropdown, toggleDropdown] = useState(false)
  const user = useSelector((state: RootState) => state.user)
  return (
    <>
      <header>
        <Flex
          bg="white"
          height="44px"
          padding="6px 12px"
          justifyContent={{ md: "space-between" }}
          align={"center"}
        >
          <Flex gap={{base: "0.5rem", sm: "2rem"}}>
            <NavLogo />
            {user.id && <CommunitySelect isOpen={dropdown} setOpen={toggleDropdown} isNav/>}
          </Flex>
          <SearchInput />
          <Flex justifyContent="space-between" alignItems="center">
            {user.id ? <AskButton /> : <AuthButtons />}
            {!!user && <UserMenu user={user}/>}
          </Flex>
        </Flex>
      </header>
    </>
  );
};

export default Nav;
