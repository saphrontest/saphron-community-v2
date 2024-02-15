import React, { FC, useEffect, useState } from 'react'
import AdminWorkshopItem from './AdminWorkshopItem'
import { Workshop } from '../../../Interface/WorkshopInterface'
import { getWorkshops } from '../../../Helpers';
import { Flex } from '@chakra-ui/react';
import { useStatus } from '../../../Hooks';

const WorkshopAdmin: FC = () => {
    const { updateStatus } = useStatus()
    const [workshops, setWorkshops] = useState<Workshop[]>()

    useEffect(() => {
        getWorkshops()
            .then((result: Workshop[] | false) => !!result && setWorkshops(result))
    }, [])

    const updateItemStatus = (itemId: string, optionId: number) => {
        return updateStatus(
            `workshops/${itemId}`,
            optionId,
            () => getWorkshops().then((result: Workshop[] | false) => !!result && setWorkshops(result))
        )
    }

    return (
        <Flex direction="column" gap="1rem">
            {workshops?.map((workshop: Workshop, idx: number) => (
                <React.Fragment key={workshop.id}>
                    <AdminWorkshopItem idx={idx} workshop={workshop} onSelect={updateItemStatus} />
                </React.Fragment>
            ))}
        </Flex>
    )

}

export default WorkshopAdmin
