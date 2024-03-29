import { getDocs, collection, doc, runTransaction, Transaction, FirestoreError, getDoc } from "firebase/firestore"
import { firestore } from "../firebaseClient"
import { ITask, ITaskControlItem, IUserTask } from "../Interface"

const useTask = () => {

    /**
     * The function `getTasks` retrieves tasks from a Firestore collection and adds control lists to
     * each task asynchronously.
     * @returns The `getTasks` function is returning an array of tasks as `ITask[]`.
     */
    const getTasks = async () => {
        const tasksDoc = await getDocs(collection(firestore, `tasks`))
        const tasks = tasksDoc.docs.map(doc => doc.data())
        return tasks as ITask[]
    }

    /**
     * The function `createTask` asynchronously creates a task in a Firestore database with optional
     * control list items.
     * @param {ITask} task - The `task` parameter in the `createTask` function is of type `ITask`,
     * which likely represents a task object with properties such as `id`, `name`, `description`, etc.
     * It is the task that you want to create or update in the Firestore database.
     * @param {ITaskControlItem[]} controlList - The `controlList` parameter in the `createTask`
     * function is an array of `ITaskControlItem` objects. It is used to determine whether to update
     * the `task` object with the `controlList` or not before saving it to the Firestore database. If
     * the `controlList` array
     * @returns The `createTask` function returns a Promise. If the transaction is successful, it
     * resolves with a boolean value of `true`. If there is an error during the transaction, it catches
     * the error, logs it to the console, throws a new Error with the error message, and the Promise is
     * rejected.
     */
    const createTask = async (task: ITask, controlList: ITaskControlItem[]) => {
        const updatedTask = controlList.length ? {...task, controlList} : task
        return runTransaction(firestore, async (tx: Transaction) => {
            tx.set(doc(firestore, `tasks/${task.id}`), {
                createdAt: new Date().toString(),
                ...updatedTask
            })
        })
        .then(() => true)
        .catch((error) => {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        })
    }

    /**
     * The function `joinTask` asynchronously adds a task to a user's tasks collection in Firestore
     * using a transaction.
     * @param {string} userId - A string representing the user ID to whom the task belongs.
     * @param {ITask} task - The `task` parameter in the `joinTask` function represents an object of
     * type `ITask`. It contains information about a specific task that a user wants to join.
     * @returns The `joinTask` function returns a Promise. If the transaction is successful, it
     * resolves with a value of `true`. If there is an error during the transaction, it catches the
     * error, logs the error message to the console, and throws a new Error with the same message.
     */
    const joinTask = async (userId: string, task: ITask) => {
        return runTransaction(firestore, async (tx: Transaction) => {
            tx.set(doc(firestore, `users/${userId}/tasks/${task.id}`), {
                ...task,
                progress: 0,
                joinedAt: new Date().toString()
            })
        })
        .then(() => true)
        .catch((error) => {
            if(error instanceof FirestoreError) {
                console.error(error.message)
                throw new Error(error.message)
              }
        })
    }

    /**
     * The function `getTasksByUserId` retrieves tasks associated with a specific user ID from
     * Firestore.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of a user. This identifier is used to retrieve tasks associated with that specific
     * user from the Firestore database.
     * @returns An array of tasks associated with the specified `userId` is being returned.
     */
    const getTasksByUserId = async (userId: string) => {
        const userTasksDoc = await getDocs(collection(firestore, `users/${userId}/tasks`))
        const userTasks = userTasksDoc.docs.map(task => task.data())
        return userTasks as IUserTask[]
    }


    return {
        getTasks,
        createTask,
        joinTask,
        getTasksByUserId 
    }
}

export default useTask
