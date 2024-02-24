import { ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { ModalLayout } from '../../Layouts'
import { SupportGroupForm } from '../SupportGroups'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setModal } from '../../redux/slices/modalSlice'
import { FC } from 'react'

const EditSupportGroupModal: FC<{toggleReloadSupportGroups: () => void}> = ({toggleReloadSupportGroups}) => {
  const dispatch = useDispatch()
  const { isOpen, view, data } = useSelector((state: RootState) => state.modal)
  return view === "editSupportGroup" ? (
    <ModalLayout isOpen={isOpen} onClose={() => dispatch(setModal({ isOpen: false, view: "editSupportGroup" }))}>
      <ModalHeader display="flex" flexDirection="column" alignItems="center">
        Edit Support Group
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        pb={6}
      >
        <SupportGroupForm isEdit={true} supportGroupData={data} reloadSupportGroups={toggleReloadSupportGroups}/>
      </ModalBody>
    </ModalLayout>
  ) : null
}

export default EditSupportGroupModal
