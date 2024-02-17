import { Flex, Spinner, Text, useBoolean } from '@chakra-ui/react'
import { PageLayout } from '../Layouts'
import { Fragment, useEffect, useState } from 'react'
import { useSupportGroup } from '../Hooks'
import { ISupportGroup } from '../Interface/SupportGroupInterface'
import { UserInterface } from '../Interface/UserInterface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { MyPlatformItem, PlatformParticipantItem } from '../Components'
import { IStatus } from '../Interface/StatusInterface'

const MySupportGroups = () => {
  const {getSupportGroupsByUserId, onDelete} = useSupportGroup()
  const user: UserInterface = useSelector((state: RootState) => state.user)
  const [supportGroups, setSupportGroups] = useState<ISupportGroup[]>([])
  const [groupsLoading, {toggle: toggleGroupsLoading}] = useBoolean(false)
  const [participantsLoading, {toggle: toggleParticipantsLoading}] = useBoolean(false)
  const [isClicked, setIsClicked] = useBoolean(false)
  const [editOpen, setEditOpen] = useBoolean(false)
  const [deleteLoading, {toggle: toggleDeleteLoading}] = useBoolean(false)
  
  useEffect(() => {
    toggleGroupsLoading()
    getSupportGroupsByUserId(user.id)
      .then(groups => !!groups.length && setSupportGroups(groups))
      .finally(() => toggleGroupsLoading())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
   
  const handleButton = async (event: any, requestId: string, status: IStatus): Promise<void> => {
    throw new Error('Function not implemented.')
  }


  return (
    <div>
      <PageLayout showSidebar={false} leftWidth="70%">
        <Flex w="100%" bg="white" p="1rem" direction="column">
            <Text fontWeight="700" fontSize="24px" align="left" mb="1rem">
              My Support Groups
            </Text>
            <Flex direction='column' gap="1rem">
              {
                supportGroups.map((group, idx) => (
                  <Fragment key={group.id}>
                    <MyPlatformItem
                      idx={idx}
                      isLoading={groupsLoading || deleteLoading}
                      isClicked={isClicked}
                      setClicked={() => setIsClicked.toggle()}
                      handleDelete={async () => {
                        toggleDeleteLoading()
                        onDelete(group)
                          .finally(() => toggleDeleteLoading())
                      }}
                      openEditModal={() => setEditOpen.toggle()}
                      item={{
                          name: group.support_group_name,
                          createdAt: group.createdAt,
                          cover_img: group.cover_img,
                          description: group.description
                      }}
                    >
                      {
                          !participantsLoading ? (
                              <>
                                  {!!group.participants?.length ? <Text fontSize={["12", "16"]} fontWeight={600} pb="1rem" textAlign="left">Join Requests</Text> : <Text fontSize={["12", "16"]}>No join request, yet!</Text>}
                                  <Flex w="100%" direction="column" gap="1rem">
                                      {group.participants?.map(participant => (
                                          <Fragment key={participant.updatedAt}>
                                              <PlatformParticipantItem participant={{
                                                id: participant.id!,
                                                userId: participant.userId,
                                                updatedAt: participant.updatedAt,
                                                motivation: participant.motivation,
                                                name: participant.name,
                                                status: participant.status
                                              }}
                                              isLoading={false}
                                              handleButton={handleButton}
                                              />
                                          </Fragment>
                                      ))}
                                  </Flex>
                              </>
                          ) : <Spinner />
                      }
                    </MyPlatformItem>
                  </Fragment>
                ))
              }
            </Flex>
        </Flex>
        <></>
      </PageLayout>
    </div>
  )
}

export default MySupportGroups
