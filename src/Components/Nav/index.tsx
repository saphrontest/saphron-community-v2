//Chakra & React
import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { AddCommunityModal, AuthModal } from "../Modals";
import { SearchInput, GoSubmit, AuthButtons, NavLogo, UserMenu } from "./Partials";
import { CommunitySelect } from "../Community";
import { auth } from "../../firebaseClient";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";

const Nav = () => {
  const [dropdown, toggleDropdown] = useState(false)
  const [user] = useAuthState(auth);
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
            {user ? <GoSubmit /> : <AuthButtons />}
            <UserMenu user={user as User}/>
          </Flex>
        </Flex>
      </header>
    </>
  );
};

export default Nav;
