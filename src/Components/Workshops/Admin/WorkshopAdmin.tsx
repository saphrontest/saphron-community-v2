import React, { FC, useEffect, useState } from 'react'
import AdminWorkshopItem from './AdminWorkshopItem'
import { Workshop } from '../../../Interface'
import { Flex, Spinner, useBoolean } from '@chakra-ui/react';
import { useStatus, useWorkshop } from '../../../Hooks';

const WorkshopAdmin: FC = () => {
    const { updateStatus } = useStatus()
    const { getWorkshops } = useWorkshop()
    const [workshops, setWorkshops] = useState<Workshop[]>()
    const [workshopsLoading, { toggle: toggleWorkshopsLoading }] = useBoolean(false)

    useEffect(() => {
        toggleWorkshopsLoading()
        getWorkshops()
            .then((result: Workshop[]) => !!result.length && setWorkshops(result))
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

    return !workshopsLoading ? (
        <Flex direction="column" gap="1rem">
            {workshops?.map((workshop: Workshop, idx: number) => (
                <React.Fragment key={workshop.id}>
                    <AdminWorkshopItem idx={idx} workshop={workshop} onSelect={updateItemStatus} />
                </React.Fragment>
            ))}
        </Flex>
    ) : <Spinner size="xl" mt="1rem" />
}

export default WorkshopAdmin
