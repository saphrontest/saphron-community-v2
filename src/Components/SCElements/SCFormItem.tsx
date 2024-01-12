import { Flex, Img, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { InputItem } from '../../Layouts'

interface SCFormItemProps {
    src?: string;
    type?: string;
    label?: string;
    name?: string;
    placeholder?: string;
    margin?: string | number;
    additionalStyles?: object;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SCFormItem:FC<SCFormItemProps> = ({ label='', name, placeholder, type="default", src, additionalStyles, onChange, ...props }) => {
    return type === 'img' ? (
        <Flex flexDir="column" align="center" gap={2} alignItems={"flex-start"} style={additionalStyles} {...props}>
            <Text fontWeight={600} whiteSpace={"nowrap"} w={"40%"}>
                {label}
            </Text>
            <Img src={src} width={130} height={130} borderRadius={130} border="2px solid" borderColor="gray.200" />
        </Flex>
    ) : (
        <Flex width={"100%"} align="center" gap={2} style={additionalStyles}>
            <Text fontWeight={600} whiteSpace={"nowrap"} w={"40%"}>
                {label}
            </Text>
            <InputItem
                mb={2}
                name={name ?? ""}
                type="text"
                onChange={onChange}
                placeholder={placeholder}
            />
        </Flex>
    ) 
}

export default SCFormItem