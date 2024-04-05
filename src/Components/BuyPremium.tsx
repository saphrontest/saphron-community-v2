import { Flex, Button, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'

const BuyPremium = () => {
    const dispatch = useDispatch()
    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            border="1px solid"
            borderColor="gray.300"
            mt={3}
            align="flex-start"
            p="1rem"
        >
            <Text fontWeight="700">
                Buy Premium Membership
            </Text>
            <Text align="left">
                Lorem ipsum dolor sit amet
                <br />
                consectetur adipisicing elit.
            </Text>
            <Button height="30px" width="100%" mt="1rem" onClick={() => dispatch(setModal({isOpen: true, view: 'paymentModal', data: {type: 'membership'}}))}>
                Buy
            </Button>
        </Flex>
    )
}

export default BuyPremium
