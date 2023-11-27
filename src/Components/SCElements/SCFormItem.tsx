import { Flex, Img, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { InputItem } from '../../Layouts'

interface SCFormItemProps {
    label?: string;
    placeholder?: string;
    type?: string;
    src?: string;
}

const SCFormItem:FC<SCFormItemProps> = ({ label='', placeholder, type="default", src, ...props }) => {
    return type === 'img' ? (
        <Flex flexDir="column" width={"100%"} align="center" gap={2} alignItems={"flex-start"} {...props}>
            <Text fontWeight={600} whiteSpace={"nowrap"} w={"40%"}>
                {label}
            </Text>
            <Img src={src} width={130} height={130} borderRadius={130} border="2px solid" borderColor="gray.200" />
        </Flex>
    ) : (
        <Flex width={"100%"} align="center" gap={2}>
            <Text fontWeight={600} whiteSpace={"nowrap"} w={"40%"}>
                {label}
            </Text>
            <InputItem
                mb={2}
                name="name"
                type="text"
                onChange={(e) => console.log(e)}
                placeholder={placeholder}
            />
        </Flex>
    ) 
}

export default SCFormItem