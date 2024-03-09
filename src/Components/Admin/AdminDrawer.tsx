import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { useRef } from "react"
import { IoMenu } from "react-icons/io5"
import { MdOutlineEvent, MdOutlineGroups3 } from "react-icons/md"
import { BsPostcardHeart } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";


function AdminDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef(null)

    return (
        <>
            <Box ref={btnRef} onClick={onOpen} as="button" bg="gray.100" height="fit-content" p="0.3rem" borderRadius="full" color="gray" _hover={{ background: "gray.300" }}>
                <IoMenu size="32px" />
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Manage Dashboard</DrawerHeader>

                    <DrawerBody display="flex" flexDirection="column" gap="0.5rem">
                        <Link to="/manager-dashboard/users">
                            <Flex p="0.5rem 1rem" bg="gray.100" borderRadius="0.4em" align="center" justify="space-between" _hover={{ background: "gray.300" }} >
                                <Flex gap="1rem">
                                    <IoMdPerson size="32px" />
                                    <Text color="gray.700" fontSize="18px" fontWeight={600}>Users</Text>
                                </Flex>
                                <IoIosArrowForward />
                            </Flex>
                        </Link>
                        <Link to="/manager-dashboard/posts">
                            <Flex p="0.5rem 1rem" bg="gray.100" borderRadius="0.4em" align="center" justify="space-between" cursor="pointer" _hover={{ background: "gray.300" }} >
                                <Flex gap="1rem">
                                    <BsPostcardHeart size="32px" />
                                    <Text color="gray.700" fontSize="18px" fontWeight={600}>Posts</Text>
                                </Flex>
                                <IoIosArrowForward />
                            </Flex>
                        </Link>
                        <Link to="/manager-dashboard/workshops">
                            <Flex p="0.5rem 1rem" bg="gray.100" borderRadius="0.4em" align="center" justify="space-between" cursor="pointer" _hover={{ background: "gray.300" }} >
                                <Flex gap="1rem">
                                    <MdOutlineEvent size="32px" />
                                    <Text color="gray.700" fontSize="18px" fontWeight={600}>Workshops</Text>
                                </Flex>
                                <IoIosArrowForward />
                            </Flex>
                        </Link>
                        <Link to="/manager-dashboard/support-groups">
                            <Flex p="0.5rem 1rem" bg="gray.100" borderRadius="0.4em" align="center" justify="space-between" cursor="pointer" _hover={{ background: "gray.300" }} >
                                <Flex gap="1rem">
                                    <MdOutlineGroups3 size="32px" />
                                    <Text color="gray.700" fontSize="18px" fontWeight={600}>Support Groups</Text>
                                </Flex>
                                <IoIosArrowForward />
                            </Flex>
                        </Link>
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </>
    )
}

export default AdminDrawer