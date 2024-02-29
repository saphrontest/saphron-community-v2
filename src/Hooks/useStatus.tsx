import { doc, updateDoc } from "firebase/firestore"
import { SelectOptions } from "../Interface"
import { firestore } from "../firebaseClient"

const useStatus = () => {
    /**
     * UPDATE STATUS BY DOC
     * The function `updateStatus` takes in a query, optionId, success, error, and end callbacks,
     * updates a document in Firestore with a new status based on the optionId, and executes the
     * appropriate callbacks.
     * @param {string} query - The `query` parameter in the `updateStatus` function is a string that
     * represents the path to a document in Firestore that you want to update.
     * @param {number} optionId - The `optionId` parameter in the `updateStatus` function represents
     * the ID of the option that will be used to update the status field in the Firestore document.
     * @param {Function} onSuccess - The `onSuccess` parameter in the `updateStatus` function is a
     * function that will be called when the status update operation is successful. It is a callback
     * function that you provide to handle the success scenario after the status has been updated in
     * the Firestore database.
     * @param {Function} onError - The `onError` parameter in the `updateStatus` function is a function
     * that handles errors that occur during the execution of the function. If an error occurs during
     * the `updateDoc` operation, the `onError` function will be called with the error as an argument.
     * @param onEnd - The `onEnd` parameter in the `updateStatus` function is a function that is called
     * after the update operation is completed, regardless of whether it was successful or not. It is
     * an optional parameter, meaning you can provide a function to be executed after the update
     * operation finishes.
     * @returns The `updateStatus` function returns a Promise that resolves to a boolean value (`true`
     * or `false`).
     */
    const updateStatus: (query: string, optionId: number, onSuccess: Function, onError?: Function, onEnd?: Function) => Promise<boolean> = async (
        query: string,
        optionId: number,
        onSuccess: Function,
        onError: Function = (err: any) => console.error(err),
        onEnd
    ) => {
        const docRef = doc(firestore, query)
        try {
            await updateDoc(docRef, {
                status: SelectOptions[optionId].label
            });
            
            onSuccess();
            return true;
        } catch (err) {
            onError(err);
            return false;
        } finally {
            onEnd && onEnd()
        }
    }
    return {
        updateStatus
    } 
  }
  
export default useStatus