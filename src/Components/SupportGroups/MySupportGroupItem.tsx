import { Flex, Spinner, Text, useBoolean } from '@chakra-ui/react'
import { FC, Fragment } from 'react'
import { IStatus, ISupportGroup } from '../../Interface'
import { MyPlatformItem, PlatformParticipantItem } from '../Platform'
import { useSupportGroup } from '../../Hooks'

interface IMySupportGroupItemProps {
    idx: number;
    group: ISupportGroup;
    groupsLoading: boolean;
    deleteLoading: boolean;
    toggleDeleteLoading: () => void;
    setEditOpen: () => void;
    handleRequest: (event: any, requestId: string, status: IStatus, groupId: string) => void;
    participantsLoading: boolean;
    toggleReloadSupportGroups: () => void;
}

const MySupportGroupItem: FC<IMySupportGroupItemProps> = ({
    idx,
    group,
    groupsLoading,
    deleteLoading,
    toggleDeleteLoading,
    setEditOpen,
    handleRequest,
    participantsLoading,
    toggleReloadSupportGroups
}) => {
    
    const {onDelete} = useSupportGroup()
    const [isClicked, setIsClicked] = useBoolean(false)

    return (
        <MyPlatformItem
            idx={idx}
            isLoading={groupsLoading || deleteLoading}
            isClicked={isClicked}
            setClicked={() => setIsClicked.toggle()}
            handleDelete={async () => {
                toggleDeleteLoading()
                onDelete(group)
                    .then(() => toggleReloadSupportGroups())
                    .finally(() => toggleDeleteLoading())
            }}
            openEditModal={setEditOpen}
            item={{
                name: group.support_group_name,
                createdAt: group.createdAt,
                cover_img: group.cover_img,
                description: group.description,
                status: group.status
            }}
        >
            {
                !participantsLoading ? (
                    <>
                        {group.participants?.length ? <Text fontSize={["12", "16"]} fontWeight={600} pb="1rem" textAlign="left">Join Requests</Text> : <Text fontSize={["12", "16"]}>No join request, yet!</Text>}
                        <Flex w="100%" direction="column" gap="1rem">
                            {group.participants?.map(participant => (
                                <Fragment key={participant.id}>
                                    <PlatformParticipantItem participant={participant}
                                        isLoading={false}
                                        handleRequestButton={async (event: any, requestId: string, status: IStatus) => {
                                            handleRequest(event, requestId, status, group.id!)
                                        }}
                                    />
                                </Fragment>
                            ))}
                        </Flex>
                    </>
                ) : <Spinner />
            }
        </MyPlatformItem>
    )
}

export default MySupportGroupItem
