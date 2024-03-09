import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import SCIcon from './SCIcon'

type PositionType = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';


interface SCEditButtonProps {
    onEdit: () => void,
    position?: PositionType;
    left?: number | string | object;
    right?: number | string | object,
    top?: number | string | object,
    transform?: string | object
}

const SCEditButton: FC<SCEditButtonProps> = ({ onEdit, position = "relative", left, top, right, transform }) => {
    return (
        <Box
        gap={2}
        top={top}
        padding={2}
        left={left}
        right={right}
        bg="gray.200"
        display={"flex"}
        onClick={onEdit}
        borderRadius={32}
        position={position}
        flexDirection={"row"}
        border={"2px solid"}
        borderColor={"white"}
        transform={transform}
        height={"fit-content"}
        width="fit-content"
        cursor={"pointer"}
        _hover={{backgroundColor: "gray.300"}}
        >
            <SCIcon name='edit' size={24} fill='#718096' />
        </Box>
    )
}

export default SCEditButton