import { Flex, Spinner, Text, useBoolean } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'
import { AdminPlatformItem, AdminStatusSelect } from '../../Platform'
import { ISupportGroup, SelectOptions } from '../../../Interface'
import { useChat, useStatus, useSupportGroup } from '../../../Hooks'
import { PlatformAdminContentLayout } from '../../../Layouts'

const AdminSupportGroups = () => {
    const { updateStatus } = useStatus()
    const { getSupportGroups } = useSupportGroup()
    const { onCreate: createChat } = useChat()
    const [supportGroupsLoading, { toggle: toggleSupportGroupsLoading }] = useBoolean(false)
    const [supportGroups, setSupportGroups] = useState<ISupportGroup[]>([])
    const [filteredSupportGroups, setFilteredSupportGroups] = useState<ISupportGroup[]>([])
    useEffect(() => {
        toggleSupportGroupsLoading()
        getSupportGroups()
            .then(result => {
                result && setSupportGroups(result)
                result && setFilteredSupportGroups(result)
            })
            .finally(() => toggleSupportGroupsLoading())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateItemStatus = async (itemId: string, optionId: number) => {
        if (SelectOptions[optionId].label === "confirmed") {
            await createChat(itemId)
        }
        return updateStatus(
            `supportGroups/${itemId}`,
            optionId,
            () => getSupportGroups().then(result => result && setSupportGroups(result))
        )
    }

    const searchSupportGroups = (searchWord: string) => {
        setFilteredSupportGroups(() => {
            return supportGroups.filter(supportGroups => {
                return supportGroups.support_group_name.toLowerCase().includes(searchWord) ||
                    supportGroups.support_group_manager_name.toLowerCase().includes(searchWord)
            })
        })
    }

    return (
        <PlatformAdminContentLayout onSearch={searchSupportGroups}>
            {supportGroupsLoading && <Spinner size="xl" mt="1rem"/>}
            {!supportGroupsLoading && filteredSupportGroups?.map((group, idx) => (
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
                        <Flex align="center" gap="1rem" pl={{ base: "2em", md: 0 }}>
                            <Text fontWeight={700} display={{ base: "block", md: "none" }}>Status</Text>
                            <AdminStatusSelect item={group} onSelect={updateItemStatus} />
                        </Flex>
                    </AdminPlatformItem>
                </Fragment>
            ))}
        </PlatformAdminContentLayout>
    )
}

export default AdminSupportGroups
