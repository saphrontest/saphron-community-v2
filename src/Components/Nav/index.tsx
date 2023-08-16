//Chakra & React
import { useRef, useState } from "react";
import {
  Flex,
  Menu,
  Box,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  useOutsideClick,
  Icon,
  MenuDivider
} from "@chakra-ui/react";
//Icons
import { ChevronDownIcon } from "@chakra-ui/icons";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
//Redux
import { useDispatch } from "react-redux";
import { setModal } from "../../redux/slices/modalSlice";
//Components
import { AuthModal } from "../Modals";
import { SearchInput, GoSubmit, AuthButtons, NavLogo } from "./Partials";

const Nav = () => {
  const menuRef = useRef(null);
  const dispatch = useDispatch()
  const [dropdown, toggleDropdown] = useState(false);

  useOutsideClick({
    ref: menuRef,
    handler: () => dropdown && toggleDropdown(prev => !prev),
  });

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
          <Menu isOpen={dropdown}>
            <MenuButton
              cursor="pointer"
              padding="0px 6px"
              borderRadius="4px"
              _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
              mr={2}
              ml={{ base: 0, md: 2 }}
              onClick={() => toggleDropdown(prev => !prev)}
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width={{ base: "auto", lg: "200px" }}
              >
                <Flex alignItems="center">
                  <>
                    <Box
                      display={{ base: "none", lg: "flex" }}
                      flexDirection="column"
                      fontSize="10pt"
                    >
                      <Text fontWeight={600}>text</Text>
                    </Box>
                  </>
                </Flex>
                <ChevronDownIcon color="gray.500" />
              </Flex>
            </MenuButton>
            <MenuList ref={menuRef}>
              <Box mt={3} mb={4}>
                <Text
                  pl={3}
                  mb={1}
                  fontSize="7pt"
                  fontWeight={500}
                  color="gray.500"
                >
                  MODERATING
                </Text>
                <MenuItem
                  width="100%"
                  fontSize="10pt"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => console.log("onClick")}
                >
                  <Flex alignItems="center">community</Flex>
                </MenuItem>
              </Box>
            </MenuList>
          </Menu>
          <SearchInput />
          <Flex justifyContent="space-between" alignItems="center">
            {/* if user or not */}
            {false ? <GoSubmit /> : <AuthButtons />} 
            <Menu>
              <MenuButton
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
              >
                <Flex alignItems="center">
                  <Flex alignItems="center">
                    {false ? (
                      <>
                        {/* Avatar should be user profile image */}
                        <Box
                          display={{ base: "none", lg: "flex" }}
                          flexDirection="column"
                          fontSize="8pt"
                          alignItems="flex-start"
                          mr={8}
                        >
                          <Text fontWeight={700}>kadri çabuk</Text>
                          <Flex alignItems="center">
                            <Icon as={IoSparkles} color="brand.100" mr={1} />
                            <Text color="gray.400">1 karma</Text>
                          </Flex>
                        </Box>
                      </>
                    ) : (
                      <Icon
                        fontSize={24}
                        mr={1}
                        color="gray.400"
                        as={VscAccount}
                      />
                    )}
                  </Flex>
                  <ChevronDownIcon color="gray.500" />
                </Flex>
              </MenuButton>
              <MenuList>
                {false ? (
                  <>
                    <MenuItem
                      fontSize="10pt"
                      fontWeight={700}
                      _hover={{ bg: "blue.500", color: "white" }}
                    >
                      <Flex alignItems="center">
                        <Icon fontSize={20} mr={2} as={CgProfile} />
                        Profile
                      </Flex>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      fontSize="10pt"
                      fontWeight={700}
                      _hover={{ bg: "blue.500", color: "white" }}
                      onClick={() => console.log("logout")}
                    >
                      <Flex alignItems="center">
                        <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                        Log Out
                      </Flex>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      fontSize="10pt"
                      fontWeight={700}
                      _hover={{ bg: "blue.500", color: "white" }}
                      onClick={() => dispatch(setModal({isOpen: true, view: "login"}))}
                    >
                      <Flex alignItems="center">
                        <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                        Log In / Sign Up
                      </Flex>
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </header>
      <AuthModal />
    </>
  );
};

export default Nav;
