import { Transaction, collection, doc, getDocs, query, runTransaction } from 'firebase/firestore'
import { firestore } from '../firebaseClient'
import { IUser, UserRoleTypes } from '../Interface'

const useAdmin = () => {
    const getUsers = async () => {
        const users: IUser[] = []
        const q = query(collection(firestore, "users"));
        const data = await getDocs(q);
        data.forEach(user => users.push({id: user.id, ...user.data()} as IUser))
        return users
    }
    const updateUserRole = async (userId: string, role: UserRoleTypes) => {
        return runTransaction(firestore, async (transaction: Transaction) => {
            return transaction.update(doc(firestore, `users/${userId}`), { role })
        })
    }
    return {
        getUsers,
        updateUserRole
    }
}

export default useAdmin
