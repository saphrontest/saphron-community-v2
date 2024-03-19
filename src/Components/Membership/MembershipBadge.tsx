import { FC, useMemo } from 'react'
import { Button, Center, Flex, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { setModal } from '../../redux/slices/modalSlice'

const MembershipBadge: FC<{ membershipType: string; showName?: boolean; }> = ({
  membershipType, showName = true
}) => {

  const dispatch = useDispatch()

  const membership = useMemo(() => {
    return {
      bg: membershipType === 'Gold' ? 'yellow.300' : membershipType === 'Silver' ? 'gray.500' : 'gray.100',
      text: membershipType === 'Gold' ? 'G' : membershipType === 'Silver' ? 'S' : 'P',
      textColor: membershipType === 'Platinium' ? 'black' : 'white'
    }
  }, [membershipType])

  return membershipType === '' ? (
    <Button onClick={() => dispatch(setModal({ isOpen: true, view: 'paymentModal', data: { type: 'membership' } }))}>
      Buy Membership
    </Button>
  ) : (
    <Flex gap="0.5rem">
      <Center
        bg={membership.bg}
        w='30px'
        h='30px'
        color={membership.textColor}
        borderRadius='full'
      >
        <Text fontWeight={700}>{membership.text}</Text>
      </Center>
      {showName && <Text fontWeight={700} fontSize="18px">
        {membershipType} Membership
      </Text>}
    </Flex>
  )
}

export default MembershipBadge
