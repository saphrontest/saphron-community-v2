import React, { FC, useState } from 'react'
import { Workshop, WorkshopStatusSelectOptionInterface } from '../../../Interface/WorkshopInterface';
import { Select, Spinner } from '@chakra-ui/react';


const AdminStatusSelect: FC<{
    workshop: Workshop;
    selectOptions: WorkshopStatusSelectOptionInterface[];
    onSelect: (worksopId: string, optionId: number) => Promise<Boolean>
}> = ({
    workshop,
    selectOptions,
    onSelect
}) => {

    const [loading, setLoading] = useState<boolean>(false)

    return loading ? <Spinner /> : (
        <Select
        variant='filled'
        value={selectOptions.find((option: WorkshopStatusSelectOptionInterface) => option.label === workshop.status)?.id}
        onChange={ev => {
            setLoading(true)
            onSelect(workshop.id, +ev.target.value)
                .finally(() => setLoading(false))
        }}
        >
            {selectOptions.map((option: WorkshopStatusSelectOptionInterface) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </Select>
    )
}

export default AdminStatusSelect