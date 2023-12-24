//Chakra & React
import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { SearchInput, GoSubmit, AuthButtons, NavLogo, UserMenu } from "./Partials";
import { CommunitySelect } from "../Community";
import { auth } from "../../firebaseClient";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Nav = () => {
  const [dropdown, toggleDropdown] = useState(false)
  // const [user] = useAuthState(auth);
  const user = useSelector((state: RootState) => state.user)
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
          {user.id && <CommunitySelect isOpen={dropdown} setOpen={toggleDropdown} isNav/>}
          <SearchInput />
          <Flex justifyContent="space-between" alignItems="center">
            {user.id ? <GoSubmit /> : <AuthButtons />}
            {!!user && <UserMenu user={user}/>}
          </Flex>
        </Flex>
      </header>
    </>
  );
};

export default Nav;
