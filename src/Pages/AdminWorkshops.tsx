import React, { useEffect, useState } from 'react'
import { UserInterface } from '../Interface/UserInterface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { PageLayout } from '../Layouts'
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
        <PageLayout showSidebar={false} leftWidth='100%'>
            <>
                <Flex w="100%" bg="white" p="1rem" direction="column" align="flex-start">
                    <Heading fontSize="18px" pb="1rem">Workshop Requests</Heading>
                    <Flex w="100%" direction="column" gap="1rem">
                        {
                            workshops?.map((workshop: Workshop, idx: number) => (
                                <React.Fragment key={workshop.id}>
                                    <AdminWorkshopItem idx={idx} workshop={workshop} onSelect={onSelect} selectOptions={selectOptions}/>
                                </React.Fragment>
                            ))
                        }
                    </Flex>
                </Flex>
            </>
            <></>
        </PageLayout>
    )
}

export default AdminWorkshops