import { Flex, Spinner, useBoolean } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'
import { useAdmin } from '../../../Hooks'
import { IUser } from '../../../Interface'
import AdminUserItem from './AdminUserItem'
const AdminUsers = () => {
  const {getUsers} = useAdmin()
  const [users, setUsers] = useState<IUser[]>([])
  const [usersLoading, {toggle: toggleUsersLoading}]  = useBoolean(false)
  

  useEffect(() => {
    
    toggleUsersLoading() 
    getUsers()
      .then(users => setUsers(users))
      .finally(() => toggleUsersLoading())

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return !usersLoading ? (
    <Flex direction="column" gap="1rem" w="100%">
      {
        users.map((user: IUser) => (
          <Fragment key={user.id}>
            <AdminUserItem user={user}/>
          </Fragment>
        ))
      }
    </Flex>
  ) : <Spinner size="xl" mt="1rem" />
}

export default AdminUsers
