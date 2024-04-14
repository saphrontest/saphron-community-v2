import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { ReactNode, useRef } from "react"
import { IoMenu } from "react-icons/io5"
import { MdOutlineEvent, MdOutlineGroups3 } from "react-icons/md"
import { BsPostcardHeart, BsAward } from "react-icons/bs";
import { IoIosArrowForward, IoMdPerson } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";
import uniqid from 'uniqid'
import { Capacitor } from "@capacitor/core";

interface ILinkItem {
    id: string;
    name: string;
    icon: ReactNode;
    link: string;
}

function AdminDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef(null)

    const BASE_ADMIN_LINK = "/manager-dashboard"

    const LINKS: ILinkItem[] = [
        {id: uniqid(), name: "users", icon: <IoMdPerson size="32px" />, link: `${BASE_ADMIN_LINK}/users`},
        {id: uniqid(), name: "posts", icon: <BsPostcardHeart size="32px" />, link: `${BASE_ADMIN_LINK}/posts`},
        {id: uniqid(), name: "workshops", icon: <MdOutlineEvent size="32px" />, link: `${BASE_ADMIN_LINK}/workshops`},
        {id: uniqid(), name: "support groups", icon: <MdOutlineGroups3 size="32px" />, link: `${BASE_ADMIN_LINK}/support-groups`},
        {id: uniqid(), name: "rewards", icon: <BsAward size="32px" />, link: `${BASE_ADMIN_LINK}/rewards`},
        {id: uniqid(), name: "task tracker", icon: <FaTasks size="32px" />, link: `${BASE_ADMIN_LINK}/task-tracker`},
    ]

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
                <DrawerContent className={Capacitor.getPlatform() === 'ios' ? 'padding-ios' : ''}>
                    <DrawerCloseButton />
                    <DrawerHeader>Manage Dashboard</DrawerHeader>

                    <DrawerBody display="flex" flexDirection="column" gap="0.5rem">
                        {LINKS.map(link => (
                            <Link to={link.link} key={link.id}>
                                <Flex p="0.5rem 1rem" bg="gray.100" borderRadius="0.4em" align="center" justify="space-between" _hover={{ background: "gray.300" }} >
                                    <Flex gap="1rem">
                                        {link.icon}
                                        <Text color="gray.700" fontSize="18px" fontWeight={600} textTransform="capitalize">{link.name}</Text>
                                    </Flex>
                                    <IoIosArrowForward />
                                </Flex>
                            </Link>
                        ))}
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </>
    )
}

export default AdminDrawer