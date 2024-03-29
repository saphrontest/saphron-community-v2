import React, { FC, useEffect, useState } from 'react'
import AdminWorkshopItem from './AdminWorkshopItem'
import { Workshop } from '../../../Interface'
import { Spinner, useBoolean } from '@chakra-ui/react';
import { useStatus, useWorkshop } from '../../../Hooks';
import { PlatformAdminContentLayout } from '../../../Layouts';

const WorkshopAdmin: FC = () => {
    const { updateStatus } = useStatus()
    const { getWorkshops } = useWorkshop()
    const [workshops, setWorkshops] = useState<Workshop[]>([])
    const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([])
    const [workshopsLoading, { toggle: toggleWorkshopsLoading }] = useBoolean(false)

    useEffect(() => {
        toggleWorkshopsLoading()
        getWorkshops()
            .then((result: Workshop[]) => {
                if (!!result.length) {
                    setWorkshops(result)
                    setFilteredWorkshops(result)
                }
            })
            .finally(() => toggleWorkshopsLoading())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateItemStatus = (itemId: string, optionId: number) => {
        return updateStatus(
            `workshops/${itemId}`,
            optionId,
            () => getWorkshops().then((result: Workshop[]) => !!result.length && setWorkshops(result))
        )
    }

    const searchWorkshops = (searchWord: string) => {
        setFilteredWorkshops(() => {
            return workshops.filter(workshop => {
                return workshop.workshop_name.toLowerCase().includes(searchWord) ||
                    workshop.workshop_manager_name.toLowerCase().includes(searchWord)
            })
        })
    }

    return (
        <PlatformAdminContentLayout onSearch={searchWorkshops}>
            {
                !workshopsLoading ? (
                    <>
                        {filteredWorkshops?.map((workshop: Workshop, idx: number) => (
                            <React.Fragment key={workshop.id}>
                                <AdminWorkshopItem idx={idx} workshop={workshop} onSelect={updateItemStatus} />
                            </React.Fragment>
                        ))}
                    </>
                ) : <Spinner size="xl" mt="1rem" />
            }
        </PlatformAdminContentLayout>
    )
}

export default WorkshopAdmin
