import { FC, useEffect, useState } from 'react'
import { ProfilePageLayout } from '../../Layouts'
import { useToast } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { usePayment, } from '../../Hooks'
import { IUser, IMembership, IPost } from '../../Interface'
import { RootState } from '../../redux/store'
import Meta from '../Meta'


const MyProfile:FC<{savedPosts: IPost[]}> = ({savedPosts}) => {
    
    const toast = useToast()
    const { checkUserMembership } = usePayment()

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const [payment_status, membership_type] = [params.get('payment_status'), params.get('membership_type')];
    
    const user: IUser = useSelector((state: RootState) => state.user)
    const { communities } = useSelector((state: RootState) => state.community)

    const [membership, setMembership] = useState<IMembership>()

    useEffect(() => {
        if (payment_status !== undefined) {
            if (payment_status === 'cancel') {
                toast({
                    title: 'Payment Error',
                    description: 'Your payment could not be received, please try again!',
                    status: 'error',
                })
                return;
            }

            user.id && checkUserMembership(user.id)
                .then(result => setMembership(result))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment_status, membership_type])

    return (
        <>
            <Meta
                title="Saphron Health | Profile"
                description="Profile Page"
            />
            <ProfilePageLayout
                user={user}
                membership={membership}
                communities={communities}
                savedPosts={savedPosts}
                isMine={true}
            />
        </>
    )
}

export default MyProfile
