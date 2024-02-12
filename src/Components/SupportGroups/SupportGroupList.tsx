import { Flex } from '@chakra-ui/react'
import { Fragment, useState } from 'react'
import SupportGroupItem from './SupportGroupItem'

const SupportGroupList = () => {
    const [selected, setSelected] = useState(-1);
    return (
        <Flex gap="1rem" w="50%" flexWrap="wrap">
            {
                [0, 1, 2, 3, 4, 5].map(r => (
                    <Fragment key={r}>
                        <SupportGroupItem item={r} selected={selected} onClick={() => setSelected(r)} />
                    </Fragment>
                ))
            }
        </Flex>
    )
}

export default SupportGroupList