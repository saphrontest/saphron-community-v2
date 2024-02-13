import React, { useEffect, useState } from 'react'
import { UserInterface } from '../Interface/UserInterface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Text } from '@chakra-ui/react'
import { PlatformAdminPageLayout } from '../Layouts'
import { getWorkshops } from '../Helpers'
import { Workshop, WorkshopStatusSelectOptionInterface } from '../Interface/WorkshopInterface'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseClient'
import { AdminWorkshopItem } from '../Components'

const AdminWorkshops = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>()
    const user: UserInterface = useSelector((state: RootState) => state.user)

    useEffect(() => {
        getWorkshops().then((result: Workshop[] | false) => !!result && setWorkshops(result))
    }, [])

    if (user.role !== 'admin') {
        return <Text>You are not allowed to see here</Text>
    }
    const selectOptions: WorkshopStatusSelectOptionInterface[] = [
        { id: 0, label: 'confirmed', select: false },
        { id: 1, label: 'waiting', select: true },
        { id: 2, label: 'rejected', select: false }
    ]

    const onSelect = async (workshopId: string, optionId: number) => {

        // TODO: if optionId is 1 => open the create meet link modal first

        const workshopRef = doc(firestore, `workshops/${workshopId}`)
        await updateDoc(workshopRef, {
            status: selectOptions[optionId].label
        })
        getWorkshops().then((result: Workshop[] | false) => !!result && setWorkshops(result))
        return true
    }


    return (
        <PlatformAdminPageLayout title='Workshop Requests'>
            {
                workshops?.map((workshop: Workshop, idx: number) => (
                    <React.Fragment key={workshop.id}>
                        <AdminWorkshopItem idx={idx} workshop={workshop} onSelect={onSelect} selectOptions={selectOptions} />
                    </React.Fragment>
                ))
            }
        </PlatformAdminPageLayout>
    )
}

export default AdminWorkshops