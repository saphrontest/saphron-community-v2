import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Avatar, Icon, Text, Box } from '@chakra-ui/react'
import { FC } from 'react'
import { VscAccount } from 'react-icons/vsc'
import { UserInterface } from '../../../../Interface/UserInterface'
import NotFoundUserPic from '../../../../assets/images/user.png'

const MenuButtonInner: FC<{user: UserInterface}> = ({user}) => {
    return (
        <Flex alignItems="center">
            <Flex alignItems="center">
                {user.id ? (
                    <>
                        <Avatar
                            mr={2}
                            style={{ width: 26, height: 26 }}
                            boxSize={user.profilePhotoURL ? 28 : 30}
                            src={user.profilePhotoURL ?? NotFoundUserPic}
                        />
                        <Box
                            mr={8}
                            fontSize="8pt"
                            flexDirection="column"
                            alignItems="flex-start"
                            display={{ base: "none", lg: "flex" }}
                        >
                            <Text fontWeight={700}>{user.displayName ?? user.email?.split("@")[0]}</Text>
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
    )
}

export default MenuButtonInner