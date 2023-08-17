import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useOutsideClick } from '@chakra-ui/react';
import { FC, useRef } from 'react'

interface CommunityProps {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

const CommunitySelect: FC<CommunityProps> = ({isOpen, setOpen}) => {
    const menuRef = useRef(null)
    useOutsideClick({
        ref: menuRef,
        handler: () => isOpen && setOpen(isOpen)
      });

    return (
        <Menu isOpen={isOpen}>
            <MenuButton
                width={"fit-content"}
                height={"32px"}
                background={"white"}
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                mr={2}
                onClick={() => setOpen(!isOpen)}
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
                        onClick={() => console.log("select community")}
                    >
                        <Flex alignItems="center">community</Flex>
                    </MenuItem>
                </Box>
            </MenuList>
        </Menu>
    )
}

export default CommunitySelect