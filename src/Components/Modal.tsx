import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { AddCommunityModal, AuthModal, CreateWorkshopModal, EditProfileModal } from './Modals'
import { useDebounce } from '../Hooks'

const Modal = () => {
    const debounce = useDebounce()
    const [isRender, setRender] = useState<Boolean>(false)
    const {isOpen, view} = useSelector((state: RootState) => state.modal)

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
            return <EditProfileModal />
        case "createWorkshop": 
            return <CreateWorkshopModal />
        default:
            return null
    }
}

export default Modal