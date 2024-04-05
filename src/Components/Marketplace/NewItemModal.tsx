import React, { ChangeEvent, FC, useRef, useState } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { ModalHeader, ModalCloseButton, ModalBody, Text, Flex, Button } from '@chakra-ui/react'
import { PlatformFormItem } from '../Platform';
import { SCIcon } from '../SCElements';

const NewItemModal: FC<{ isOpen: boolean; setOpen: () => void; }> = ({
    isOpen, setOpen
}) => {
    
    const itemPicRef = useRef<HTMLInputElement | null>(null)
    const [itemImg, setItemImg] = useState<string>('')

    const onImgChange = (event: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setItemImg(readerEvent.target?.result as string)
            }
        };
    }

    const handleSubmit = () => {

    }

    return (
        <ModalLayout isOpen={isOpen} onClose={setOpen}>
            <ModalHeader textAlign="left" fontSize="16px">
                <Text>
                    New Item
                </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" gap="1rem" flexDirection="column">
                <PlatformFormItem label="Item Name">
                    <InputItem name='item_name' type='text'/>
                </PlatformFormItem>
                <PlatformFormItem label="Item Price">
                    <InputItem name='item_price' type='number'/>
                </PlatformFormItem>
                <PlatformFormItem label="Item Image">
                    <input type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" ref={itemPicRef} onChange={onImgChange} />
                    <Flex
                        w="100%"
                        h="70px"
                        bg="gray.50"
                        bgImg={itemImg}
                        bgPos="center center"
                        backgroundSize="cover"
                        borderRadius={4}
                        align="center"
                        justify="center"
                        cursor="pointer"
                        onClick={() => itemPicRef.current && itemPicRef.current.click()}
                    >
                        {!itemImg && <SCIcon size={24} name='add' />}
                    </Flex>
                </PlatformFormItem>
                <Flex justify="flex-end" gap="1rem">
                    <Button onClick={setOpen} variant="outline">Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default NewItemModal
