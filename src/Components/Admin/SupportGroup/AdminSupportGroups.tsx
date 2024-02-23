import { Flex, Spinner, useBoolean } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'
import { AdminPlatformItem, AdminStatusSelect } from '../../Platform'
import { ISupportGroup, SelectOptions } from '../../../Interface'
import { useChat, useStatus, useSupportGroup } from '../../../Hooks'

const AdminSupportGroups = () => {
    const { updateStatus } = useStatus()
    const { getSupportGroups } = useSupportGroup()
    const { onCreate: createChat } = useChat()
    const [supportGroupsLoading, { toggle: toggleSupportGroupsLoading }] = useBoolean(false)
    const [supportGroups, setSupportGroups] = useState<ISupportGroup[]>()

    useEffect(() => {
        toggleSupportGroupsLoading()
        getSupportGroups()
            .then(result => result && setSupportGroups(result))
            .finally(() => toggleSupportGroupsLoading())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateItemStatus = async (itemId: string, optionId: number) => {
        if(SelectOptions[optionId].label === "confirmed") {
            await createChat(itemId)
        }
        return updateStatus(
            `supportGroups/${itemId}`,
            optionId,
            () => getSupportGroups().then(result => result && setSupportGroups(result))
        )
    }

    return !supportGroupsLoading ? (
        <Flex direction="column" gap="1rem">
            {supportGroups?.map((group, idx) => (
                <Fragment key={group.id}>
                    <AdminPlatformItem
                        idx={idx}
                        coverImg={group.cover_img}
                        name={group.support_group_name}
                        createdAt={group.createdAt}
                        userAvatar={group.support_group_manager_avatar}
                        userId={group.support_group_manager_id}
                        userName={group.support_group_manager_name}
                        userEmail={group.support_group_manager_mail}
                    >
                        <AdminStatusSelect
                            item={group}
                            onSelect={updateItemStatus}
                        />
                    </AdminPlatformItem>
                </Fragment>
            ))}
        </Flex>
    ) : <Spinner size="xl" mt="1rem" />
}

export default AdminSupportGroups
