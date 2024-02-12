import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useDebounce } from '../Hooks'
import {
    AddCommunityModal,
    AuthModal,
    CreateSupportGroupModal,
    CreateWorkshopModal,
    EditProfileModal,
    JoinSupportGroupModal,
    JoinWorkshopModal
} from './Modals'

const Modal = () => {
    const debounce = useDebounce()
    const [isRender, setRender] = useState<Boolean>(false)
    const {isOpen, view, data} = useSelector((state: RootState) => state.modal)

    useEffect(() => {
        if(isOpen) {
            setRender(true)
        }else{
            debounce(() => setRender(false), 500)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    if(!isRender) {
        return null
    }

    switch (view) {
        case "addCommunity":
            return <AddCommunityModal />    
        case "login":
        case "signup":
            return <AuthModal />    
        case "editProfile":
            return <EditProfileModal data={data}/>
        case "createWorkshop": 
            return <CreateWorkshopModal />
        case "joinWorkshop": 
            return <JoinWorkshopModal data={data}/>
        case "createSupportGroup": 
            return <CreateSupportGroupModal />
        case "joinSupportGroup": 
            return <JoinSupportGroupModal data={data}/>
        default:
            return null
    }
}

export default Modal