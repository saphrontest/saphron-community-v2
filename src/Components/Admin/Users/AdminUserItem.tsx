import { Flex, Avatar, Spinner, Select, Text, useBoolean } from '@chakra-ui/react'
import { FC } from 'react'
import { IUser, UserRoleTypes } from '../../../Interface'
import { useAdmin } from '../../../Hooks'

const AdminUserItem: FC<{ user: IUser }> = ({ user }) => {

    const { updateUserRole } = useAdmin()

    const [roleLoading, { toggle: toggleRoleLoading }] = useBoolean(false)

    const handleRoleSelect = (role: UserRoleTypes, userId: string) => {
        toggleRoleLoading()
        updateUserRole(userId, role)
            .finally(() => toggleRoleLoading())
    }

    return (
        <Flex p="1rem" bg="gray.50" borderRadius="1rem" gap="1rem" align="center" w="100%" justify="space-between">
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
                    roleLoading ? <Spinner /> : <Select variant='filled' value={user.role} onChange={ev => handleRoleSelect(ev.target.value as UserRoleTypes, user.id)}>
                        {["user", "admin"].map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>
                }
            </Flex>
        </Flex>
    )
}

export default AdminUserItem
