import { Flex, Text, useBoolean } from '@chakra-ui/react'
import { PageLayout } from '../Layouts'
import { Fragment, useEffect, useState } from 'react'
import { useSupportGroup } from '../Hooks'
import { ISupportGroup } from '../Interface/SupportGroupInterface'
import { UserInterface } from '../Interface/UserInterface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { MySupportGroupItem } from '../Components'
import { IStatus } from '../Interface/StatusInterface'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseClient'

const MySupportGroups = () => {
  const {getSupportGroupsByUserId} = useSupportGroup()
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

  const handleRequest = async (event: any, requestId: string, status: IStatus, supportGroupId: string): Promise<void> => {
    event.stopPropagation()
    toggleParticipantsLoading()
    updateDoc(doc(firestore, `supportGroups/${supportGroupId}/participants/${requestId}`), {
      status: status
    })
    .then(() => {
      toggleGroupsLoading()
      getSupportGroupsByUserId(user.id)
        .then(groups => !!groups.length && setSupportGroups(groups))
        .finally(() => toggleGroupsLoading())
    })
    .finally(() => toggleParticipantsLoading())
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
                    <MySupportGroupItem
                    idx={idx}
                    group={group}
                    groupsLoading={groupsLoading}
                    deleteLoading={deleteLoading}
                    isClicked={isClicked}
                    setIsClicked={setIsClicked}
                    toggleDeleteLoading={toggleDeleteLoading}
                    setEditOpen={setEditOpen}
                    handleRequest={handleRequest}
                    participantsLoading={participantsLoading}
                    />
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
