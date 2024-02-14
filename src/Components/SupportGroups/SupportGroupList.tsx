import { Flex } from '@chakra-ui/react'
import { FC, Fragment } from 'react'
import SupportGroupItem from './SupportGroupItem'
import { ISupportGroup } from '../../Interface/SupportGroupInterface'

const SupportGroupList: FC<{
    list: ISupportGroup[];
    selected: ISupportGroup;
    setSelected: (item: ISupportGroup) => void;
}> = ({
    list, selected, setSelected
}) => {
    return (
        <Flex gap="1rem" w="50%" flexWrap="wrap">
            {
                list.map((item: ISupportGroup) => (
                    <Fragment key={item.id}>
                        <SupportGroupItem item={item} selected={selected} onClick={() => setSelected(item)} />
                    </Fragment>
                ))
            }
        </Flex>
    )
}

export default SupportGroupList