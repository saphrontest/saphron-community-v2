import { Flex, useMediaQuery } from '@chakra-ui/react'
import { FC, Fragment } from 'react'
import SupportGroupItem from './SupportGroupItem'
import { ISupportGroup } from '../../Interface/SupportGroupInterface'

interface ISupportGroupListProps {
    list?: ISupportGroup[];
    selected?: ISupportGroup;
    setSelected?: (item: ISupportGroup) => void;
}

const Mobile: FC<ISupportGroupListProps> = ({ list }) => {
    return (
        <Flex direction="column" gap="1rem" w="100%">
            { list && list.map((item: ISupportGroup, idx: number) => (
                <Fragment key={idx}>
                    <SupportGroupItem.Mobile item={item} idx={idx}/>
                </Fragment>
            ))}
        </Flex>
    )
}

const Desktop: FC<ISupportGroupListProps> = ({ list, selected, setSelected }) => {
    return (
        <Flex direction="row" align="flex-start" gap="1rem" w="50%" h="fit-content" flexWrap="wrap">
            {
                list && list
                    .map((item: ISupportGroup,) => (
                        <SupportGroupItem.Desktop key={item.id} item={item} selected={selected} onClick={() => setSelected && setSelected(item)}/>
                    ))
            }
        </Flex>
    )
}

const SupportGroupList:FC<ISupportGroupListProps> = ({ 
    list, selected, setSelected
 }) => {
    const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
    return isSmallerThan766 ? <Mobile list={list} /> : <Desktop selected={selected} setSelected={setSelected} list={list} />
}

export default SupportGroupList