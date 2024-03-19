import {
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Text,
    List,
    ListIcon,
    ListItem,
    Button,
    useBoolean,
    Spinner
} from '@chakra-ui/react'
import { ModalLayout } from '../../Layouts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setModal } from '../../redux/slices/modalSlice'
import { IMembership, IUser, ModalInterface } from '../../Interface'
import { FC, useEffect, useState } from 'react'
import { MdCheckCircle } from 'react-icons/md'
import { usePayment } from '../../Hooks'

const MemberTypeCard: FC<{ name: string; price: number; onSelect: () => void, isActive: boolean; }> = ({
    name, price, onSelect, isActive
}) => {
    return (
        <Flex
            p="1rem"
            flex={1}
            bg="gray.100"
            display="flex"
            cursor="pointer"
            border="2px solid"
            onClick={onSelect}
            borderRadius="1rem"
            flexDirection="column"
            borderColor={isActive ? "blue.500" : "transparent"}
        >
            <Text fontSize="22px" fontWeight={700} mb={3}>
                {name}
            </Text>
            <List spacing={2}>
                <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Lorem ipsum dolor sit amet
                </ListItem>
                <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Lorem ipsum dolor sit amet
                </ListItem>
                <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Lorem ipsum dolor sit amet
                </ListItem>
                <ListItem>
                    <ListIcon as={MdCheckCircle} color='green.500' />
                    Lorem ipsum dolor sit amet
                </ListItem>
            </List>
            <Text mt="1rem" color="blue.500" fontSize="24px" fontWeight={800}>{price}$</Text>

        </Flex>
    )
}

const PaymentModal = () => {
    const dispatch = useDispatch()
    const { getProductList, buyMembership } = usePayment()
    
    const [products, setProducts] = useState<IMembership[]>([])
    const [choosenMembership, setChoosenMembership] = useState<IMembership>()
    const [paymentLoading, {toggle: togglePaymentLoading}] = useBoolean(false)
    
    const modal: ModalInterface = useSelector((state: RootState) => state.modal)
    const user: IUser = useSelector((state: RootState) => state.user)
    
    useEffect(() => {
        if(modal.isOpen){
            getProductList()
            .then(result => {
                setProducts(result)
                if(modal.data.currentMembership) {
                    setChoosenMembership(result.find(item => item.name.split(' ')[0] === modal.data.currentMembership))
                } else {
                    setChoosenMembership(result[0])
                }
            })
            .catch(error => console.error(error))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePayment = async () => {
        togglePaymentLoading()
        try {
            await buyMembership(user.id, choosenMembership as IMembership)
        } catch (error: any) {
            
        } finally {
            togglePaymentLoading()
        }
    }
    
    return (
        <ModalLayout
        size='6xl'
        isOpen={modal.isOpen}
        onClose={() => dispatch(setModal({ isOpen: false, view: null, data: null }))}
        >
            <ModalHeader>
                {modal.data.type === 'membership' && 'Premium Membership'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                pb={6}
            >
                <Text align="left" fontWeight="700" fontSize="18px" w="100%" mb="1rem">
                    Choose one of our membership plan
                </Text>
                <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    gap="1rem"
                >
                    {products?.map(item => {
                        return <MemberTypeCard
                        key={item.id}
                        name={item.name}
                        price={item.prices[0].unit_amount}
                        onSelect={() => setChoosenMembership(item)}
                        isActive={choosenMembership?.id === item.id} />
                    })}
                </Flex>
                <Flex mt="2rem" gap="1rem" justify="center" align="center" w="100%">
                    <Button variant='outline' w="150px">Cancel</Button>
                    <Button
                    w="150px"
                    onClick={handlePayment}
                    >
                        {paymentLoading ? <Spinner /> : "Go Payment"}
                    </Button>
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default PaymentModal
