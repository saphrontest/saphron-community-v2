import { Transaction, collection, doc, getDocs, query, runTransaction } from 'firebase/firestore'
import { firestore } from '../firebaseClient'
import { IUser, UserRoleTypes } from '../Interface'

const useAdmin = () => {
    /**
     * GET ALL USERS
     * This function retrieves user data from a Firestore collection in a TypeScript React application.
     * @returns An array of IUser objects is being returned. Each IUser object contains the id of the
     * user document and the data of the user document retrieved from the Firestore database.
     */
    const getUsers = async () => {
        const users: IUser[] = []
        const q = query(collection(firestore, "users"));
        const data = await getDocs(q);
        data.forEach(user => users.push({id: user.id, ...user.data()} as IUser))
        return users
    }
    /**
     * UPDATE USER ROLE
     * The function `updateUserRole` updates the role of a user in a Firestore database
     * transactionally.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of the user whose role is being updated.
     * @param {UserRoleTypes} role - The `role` parameter in the `updateUserRole` function represents
     * the type of role that you want to assign to a user. It is of type `UserRoleTypes`, which likely
     * defines the different roles that a user can have in your system, such as "admin", "user",
     * "moderator
     * @returns The `updateUserRole` function is returning a Promise that resolves to the result of
     * running a transaction in Firestore to update the role of a user with the specified `userId`.
     */
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
