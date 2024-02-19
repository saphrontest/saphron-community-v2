import { FC, useState } from 'react'
import { Select, Spinner } from '@chakra-ui/react';
import { IStatusOption, SelectOptions, Workshop, ISupportGroup } from '../../../Interface';

const AdminStatusSelect: FC<{
    item: Workshop | ISupportGroup;
    onSelect: (itemId: string, optionId: number) => Promise<boolean>
}> = ({
    item,
    onSelect
}) => {
    const [loading, setLoading] = useState<boolean>(false)

    return loading ? <Spinner /> : (
        <Select
        variant='filled'
        value={SelectOptions.find((option: IStatusOption) => option.label === item.status)?.id}
        onChange={ev => {
            setLoading(true)
            item.id && onSelect(item.id, +ev.target.value)
                .finally(() => setLoading(false))
        }}
        >
            {SelectOptions.map((option: IStatusOption) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </Select>
    )
}

export default AdminStatusSelect