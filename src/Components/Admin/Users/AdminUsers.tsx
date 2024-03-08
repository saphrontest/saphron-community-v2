import { Flex, Spinner, useBoolean } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'
import { useAdmin } from '../../../Hooks'
import { IUser } from '../../../Interface'
import AdminUserItem from './AdminUserItem'
import SearchInput from '../SearchInput'
const AdminUsers = () => {
  const {getUsers} = useAdmin()
  const [users, setUsers] = useState<IUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [usersLoading, {toggle: toggleUsersLoading}]  = useBoolean(false)
  

  useEffect(() => {
    getUserList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const getUserList = (isLoading: boolean = true) => {
    isLoading && toggleUsersLoading() 
    getUsers()
      .then(result => {
        setUsers(result)
        setFilteredUsers(result)
      })
      .finally(() => isLoading && toggleUsersLoading())
  }

  const searchUsers = (searchWord: string) => {
    setFilteredUsers(() => {
      return users.filter(user => {
          return user.displayName.toLowerCase().includes(searchWord) ||
          user.username.toLowerCase().includes(searchWord) ||
          user.email.toLowerCase().includes(searchWord)
      })
  })
  }


  return (
    <>
      <SearchInput onSearch={searchUsers}/>

      {
        !usersLoading ? (
          <Flex direction="column" gap="1rem" w="100%">
            {
              filteredUsers.map((user: IUser) => (
                <Fragment key={user.id}>
                  <AdminUserItem user={user} getUserList={getUserList}/>
                </Fragment>
              ))
            }
          </Flex>
        ) : <Spinner size="xl" mt="1rem" />
      }
    </>
  )
}

export default AdminUsers
