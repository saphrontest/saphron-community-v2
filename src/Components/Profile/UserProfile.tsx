import { FC, useEffect, useState } from 'react'
import { ProfilePageLayout } from '../../Layouts'
import { IMembership, IPost, IUser } from '../../Interface'
import { getUser } from '../../Helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Meta from '../Meta';
import { usePayment } from '../../Hooks';
import { Spinner, Text, useBoolean } from '@chakra-ui/react';

const UserProfile: FC<{
  userId: string;
  savedPosts: IPost[];
}> = ({ userId, savedPosts }) => {
  
  const { checkUserMembership } = usePayment()
  
  const [user, setUser] = useState<IUser>()
  const [membership, setMembership] = useState<IMembership>()
  const [userLoading, {toggle: toggleUserLoading}] = useBoolean(false)
  
  const { communities } = useSelector((state: RootState) => state.community)

  const initFunctions = async () => {

    getUser(userId, 'query')
        .then(result => setUser(result))
      
    checkUserMembership(userId)
      .then(result => setMembership(result))

  }

  useEffect(() => {
    if (userId) {

      toggleUserLoading()

      initFunctions()
        .finally(() => toggleUserLoading()) 

    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if(userLoading) {
    return <Spinner size='lg' />
  }

  if( !userLoading && !user ) {
    return (
      <Text>
        User could not be found!
      </Text>
    )
  }

  if( !userLoading && user ) {
    return (
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
    )
  }

  return <></>

}

export default UserProfile
