import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { ModalHeader, ModalCloseButton, ModalBody, Text, Flex, Button, useToast, useBoolean, Spinner, useConst } from '@chakra-ui/react'
import { PlatformFormItem } from '../Platform';
import { SCIcon } from '../SCElements';
import { doc, FirestoreError, runTransaction, Transaction } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseClient';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import md5 from 'md5';
import { IRewardItem } from '../../Interface';

const NewItemModal: FC<{
    isOpen: boolean;
    setOpen: () => void;
    reloadItems: () => void;
    item?: IRewardItem;
    handleEdit?: (id: string, data: {
        name: string;
        price: number;
        img: string;
    }) => void;
}> = ({
    isOpen, setOpen, reloadItems, item, handleEdit
}) => {

    const toast = useToast()
    const itemPicRef = useRef<HTMLInputElement | null>(null)
    const isEdit = useConst(() => !!item)
    const [loading, {toggle: toggleLoading}] = useBoolean(false)
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

    const uploadImage = async (img: string, rewardItemId: string) => {
        try {
            const imageRef = ref(storage, `rewardItems/${rewardItemId}`);
            await uploadString(imageRef, img, "data_url");
            const photoURL = await getDownloadURL(imageRef);
            return photoURL
        } catch (error: any) {
            console.log(error)
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        }
    };

    const handleSubmit = async () => {
        toggleLoading();

        if(isEdit) {
            try {
                const imgUrl = (item?.img !== itemImg && item?.img) && await uploadImage(itemImg, item?.img);
                (item?.id && handleEdit) && handleEdit(item?.id, { img: imgUrl || item.img, ...form })
            } catch (error) {
                console.error(error); // Log the error for debugging
                if (error instanceof FirestoreError) {
                    toast({ title: error.message, status: "error", isClosable: true });
                }
            } finally {
                setOpen()
                toggleLoading();
            }
            return;
        }

        try {
            const newId = md5(`${new Date().toString()}.${form.name}`);
            const rewardItemDocRef = doc(firestore, `rewardItems/${newId}`);
            const imgUrl = await uploadImage(itemImg, newId);
            await runTransaction(firestore, async (tx: Transaction) => {
                await tx.set(rewardItemDocRef, { ...form, img: imgUrl, createdAt: new Date().toString() });
            });
            await reloadItems()
            setOpen()
        } catch (error) {
            console.error(error); // Log the error for debugging
            if (error instanceof FirestoreError) {
                toast({ title: error.message, status: "error", isClosable: true });
            }
        } finally {
            toggleLoading();
        }
    };

    useEffect(() => {
        if(isEdit) {
            setForm({
                name: item?.name || '',
                price: item?.price || 0
            })
            item?.img && setItemImg(item?.img)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit])

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
                    <InputItem name='item_name' type='text' placeholder={item?.name || ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({...prev, name: event.target.value}))}/>
                </PlatformFormItem>
                <PlatformFormItem label="Item Price">
                    <InputItem name='item_price' type='number' placeholder={item?.price ? `${item?.price}` : ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({...prev, price: +event.target.value}))}/>
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
                    <Button onClick={handleSubmit}>{loading ? <Spinner /> : "Submit"}</Button>
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default NewItemModal
