import React, { useEffect, useState } from 'react'
import { usePayment } from '../../Hooks'
import { IMembership, IUser } from '../../Interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import BuyPremium from '../BuyPremium'
import { Button, Flex } from '@chakra-ui/react'
import { setModal } from '../../redux/slices/modalSlice'
import MembershipBadge from './MembershipBadge'

const MembershipSide = () => {

    const dispatch = useDispatch()
    const {checkUserMembership} = usePayment()
    const [membership, setMembership] = useState<IMembership>()

    const user: IUser = useSelector((state: RootState) => state.user)

    useEffect(() => {
        user.id && checkUserMembership(user.id)
            .then(result => result && setMembership(result))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return membership && membership.active ? (
        <Flex
        direction="column"
        bg="white"
        borderRadius={4}
        cursor="pointer"
        border="1px solid"
        borderColor="gray.300"
        align="flex-start"
        p="1rem"
        mt={3}
        gap="1rem"
    >
        <MembershipBadge membershipType={membership?.name.split(' ')[0] || ''}/>
        <Button height="30px" width="100%" onClick={() => dispatch(setModal({isOpen: true, view: 'paymentModal', data: {type: 'membership', currentMembership: membership?.name.split(' ')[0]}}))}>
            Change Plan
        </Button>
    </Flex>
    ) : <BuyPremium />
}

export default MembershipSide
