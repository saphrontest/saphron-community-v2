import { doc, updateDoc } from "firebase/firestore"
import { SelectOptions } from "../Interface/StatusInterface"
import { firestore } from "../firebaseClient"

const useStatus = () => {
    const updateStatus: (query: string, optionId: number, onSuccess: Function, onError?: Function, onEnd?: Function) => Promise<Boolean> = async (
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