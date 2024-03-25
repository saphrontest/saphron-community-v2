import { FC, useEffect, useState } from 'react'
import { ProfilePageLayout } from '../../Layouts'
import { IMembership, IPost, IUser } from '../../Interface'
import { getUser } from '../../Helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Meta from '../Meta';
import { usePayment } from '../../Hooks';
import { Spinner } from '@chakra-ui/react';

const UserProfile: FC<{
  userId: string;
  savedPosts: IPost[];
}> = ({ userId, savedPosts }) => {
  
  const { checkUserMembership } = usePayment()
  
  const [user, setUser] = useState<IUser>()
  const [membership, setMembership] = useState<IMembership>()
  
  const { communities } = useSelector((state: RootState) => state.community)

  useEffect(() => {

    if (userId) {
      
      getUser(userId, 'query')
        .then(result => setUser(result))
      
      checkUserMembership(userId)
        .then(result => setMembership(result))
      
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return user ? (
    <>
      <Meta
        title={`Saphron Health | ${user.displayName}`}
        description="Profile Page"
      />
      <ProfilePageLayout
        user={user}
        communities={communities}
        isMine={false}
        savedPosts={savedPosts}
        membership={membership}
      />
    </>
  ) : <Spinner size="xl" />
}

export default UserProfile
