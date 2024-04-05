import React, { ChangeEvent, FC, useRef, useState } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { ModalHeader, ModalCloseButton, ModalBody, Text, Flex, Button, useToast } from '@chakra-ui/react'
import { PlatformFormItem } from '../Platform';
import { SCIcon } from '../SCElements';
import { collection, doc, FirestoreError, runTransaction, Transaction } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseClient';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import md5 from 'md5';

const NewItemModal: FC<{ isOpen: boolean; setOpen: () => void; }> = ({
    isOpen, setOpen
}) => {

    const toast = useToast()
    const itemPicRef = useRef<HTMLInputElement | null>(null)
    const [itemImg, setItemImg] = useState<string>('')
    const [form, setForm] = useState<{
        name: string;
        price: number;
    }>({
        name: '',
        price: 0
    })

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

    const updateImage = async (img: string, rewardItemId: string) => {
        try {
            const imageRef = ref(storage, `rewards/${rewardItemId}`);
            await uploadString(imageRef, img, "data_url");
            const photoURL = await getDownloadURL(imageRef);
            return photoURL
        } catch (error: any) {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        }
    };

    const handleSubmit = async () => {
        try {
            const newId = md5(`${new Date().toString()}.${form.name}`);
            const rewardItemDocRef = doc(collection(firestore, `rewardItems/${newId}`));
            const imgUrl = await updateImage(itemImg, newId)
            return runTransaction(firestore, async (tx: Transaction) => {
                tx.set(rewardItemDocRef, { ...form, img: imgUrl, createdAt: new Date().toString() })
            })
        } catch (error) {
            if(error instanceof FirestoreError) {
                toast({ title: error.message, status: "error", isClosable: true, })
              }
        }
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
                    <InputItem name='item_name' type='text' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({...prev, name: event.target.value}))}/>
                </PlatformFormItem>
                <PlatformFormItem label="Item Price">
                    <InputItem name='item_price' type='number' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({...prev, price: +event.target.value}))}/>
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
