//Chakra & React
import { Flex } from "@chakra-ui/react";
import { SearchInput, AskButton, AuthButtons, NavLogo, UserMenu } from "./Partials";
import { CommunitySelect } from "../Community";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Nav = () => {

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
          <Flex gap={{base: "0.5rem", sm: "2rem"}}>
            <NavLogo />
            {user.id && <CommunitySelect isNav showTitleOnMobile={false}/>}
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
