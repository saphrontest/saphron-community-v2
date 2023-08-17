//Chakra & React
import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { AuthModal } from "../Modals";
import { SearchInput, GoSubmit, AuthButtons, NavLogo, UserMenu } from "./Partials";
import { CommunitySelect } from "../Community";

const Nav = () => {
  const [dropdown, toggleDropdown] = useState(false)

  return (
    <>
      <header>
        <Flex
          bg="white"
          height="44px"
          padding="6px 12px"
          justifyContent={{ md: "space-between" }}
        >
          <NavLogo />
          <CommunitySelect isOpen={dropdown} setOpen={toggleDropdown} />
          <SearchInput />
          <Flex justifyContent="space-between" alignItems="center">
            {/* if user or not */}
            {false ? <GoSubmit /> : <AuthButtons />}
            <UserMenu />
          </Flex>
        </Flex>
      </header>
      <AuthModal />
    </>
  );
};

export default Nav;
