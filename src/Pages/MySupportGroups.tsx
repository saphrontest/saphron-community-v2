import { Flex, Text, useBoolean } from '@chakra-ui/react'
import { PageLayout } from '../Layouts'
import { Fragment, useEffect, useState } from 'react'
import { useSupportGroup } from '../Hooks'
import { ISupportGroup, IUser, IStatus } from '../Interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { MySupportGroupItem } from '../Components'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseClient'
import { setModal } from '../redux/slices/modalSlice'
import { EditSupportGroupModal } from '../Components/Modals'

const MySupportGroups = () => {
  const dispatch = useDispatch()
  const {getSupportGroupsByUserId} = useSupportGroup()
  
  const [supportGroups, setSupportGroups] = useState<ISupportGroup[]>([])
  const [groupsLoading, {toggle: toggleGroupsLoading}] = useBoolean(false)
  const [participantsLoading, {toggle: toggleParticipantsLoading}] = useBoolean(false)
  const [isClicked, setIsClicked] = useBoolean(false)
  const [deleteLoading, {toggle: toggleDeleteLoading}] = useBoolean(false)
  const [reloadSupportGroups, {toggle: toggleReloadSupportGroups}] = useBoolean(false)
  
  const user: IUser = useSelector((state: RootState) => state.user)

  const getGroups = (isReload: boolean = false) => {
    toggleGroupsLoading()
    getSupportGroupsByUserId(user.id)
      .then(groups => !!groups.length && setSupportGroups(groups))
      .finally(() => {
        toggleReloadSupportGroups()
        isReload && toggleGroupsLoading()
      })
  }

  useEffect(() => {
    getGroups()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(reloadSupportGroups) {
      getGroups(reloadSupportGroups)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadSupportGroups])
  
  const handleRequest = async (event: any, requestId: string, status: IStatus, supportGroupId: string): Promise<void> => {
    event.stopPropagation()
    toggleParticipantsLoading()
    updateDoc(doc(firestore, `supportGroups/${supportGroupId}/participants/${requestId}`), {
      status: status
    })
    .then(() => getGroups())
    .finally(() => toggleParticipantsLoading())
  }

  return (
    <>
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
                    setEditOpen={() => dispatch(setModal({isOpen: true, view: "editSupportGroup", data: group}))}
                    handleRequest={handleRequest}
                    participantsLoading={participantsLoading}
                    toggleReloadSupportGroups={toggleReloadSupportGroups}
                    />
                  </Fragment>
                ))
              }
            </Flex>
        </Flex>
        <></>
      </PageLayout>
      <EditSupportGroupModal />
    </>
  )
}

export default MySupportGroups
