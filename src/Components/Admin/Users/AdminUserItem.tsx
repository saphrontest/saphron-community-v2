import { Flex, Avatar, Spinner, Select, Text, useBoolean } from '@chakra-ui/react'
import { FC } from 'react'
import { IUser, UserRoleTypes } from '../../../Interface'
import { useAdmin } from '../../../Hooks'

const AdminUserItem: FC<{ user: IUser, getUserList: (isLoading: boolean) => void }> = ({ user, getUserList }) => {

    const { updateUserRole } = useAdmin()

    const [roleLoading, { toggle: toggleRoleLoading }] = useBoolean(false)

    const handleRoleSelect = (role: UserRoleTypes, userId: string) => {
        toggleRoleLoading()
        updateUserRole(userId, role)
        .then(() => getUserList(false))
            .finally(() => toggleRoleLoading())
    }

    return (
        <Flex direction={{base: "column", md: "row"}} p="1rem" bg="gray.50" borderRadius="1rem" gap="1rem" align={{base: "flex-start", md: "center"}} w="100%" justify="space-between">
            <Flex gap="1rem" align="center">
                <Avatar src={user.profilePhotoURL} />
                <Flex direction="column" align="flex-start">
                    <Text fontSize="12px" color="gray">
                        #{user.id}
                    </Text>
                    <Text fontWeight="700">
                        {user.displayName}
                    </Text>
                    <Text fontStyle="italic">
                        {user.email}
                    </Text>
                </Flex>
            </Flex>
            <Flex>
                {
                    roleLoading ? <Spinner /> : (
                        <Flex align="center" gap="1rem">
                            <Text fontWeight={700} display={{base: "block", md: "none"}}>Status</Text>
                            <Select variant='filled' value={user.role} onChange={ev => handleRoleSelect(ev.target.value as UserRoleTypes, user.id)}>
                                {["user", "admin"].map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        </Flex>
                    )
                }
            </Flex>
        </Flex>
    )
}

export default AdminUserItem
