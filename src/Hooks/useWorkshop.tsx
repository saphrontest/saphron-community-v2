import { QueryDocumentSnapshot, collection, doc, getDocs, query, runTransaction } from "firebase/firestore";
import { UserWorkshops, Workshop, WorkshopRequest } from "../Interface";
import { firestore } from "../firebaseClient";
import { useToast } from "@chakra-ui/react";

const useWorkshop = () => {

    const toast = useToast()

    /**
     * The function `getWorkshops` retrieves workshops from a Firestore database, retrieves
     * participants for each workshop, and returns an array of workshops with their respective
     * participants.
     * @returns The function `getWorkshops` is returning an array of Workshop objects.
     */
    const getWorkshops = async () => {
        const result: Workshop[] = []
        const data = await getDocs(query(collection(firestore, 'workshops')));
    
        const promises = data.docs.map(async (data: QueryDocumentSnapshot) => {
            const participants = await getParticipantsByWorkshopID(data.id)
            return {
                ...data.data(),
                id: data.id,
                participants: participants.length ? participants : []
            } as Workshop;
        });
    
        // Wait for all promises to resolve using Promise.all
        const workshops = await Promise.all(promises);
        result.push(...workshops);
    
        return result;
    };

    /**
     * The function retrieves workshop join requests for a specific user ID.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of a user.
     * @returns The function `getWorkshopRequestsByUserID` returns an array of `WorkshopRequest`
     * objects.
     */
    const getWorkshopRequestsByUserID = async (userId: string) => {
        const result: WorkshopRequest[] = []
        const data = await getDocs(query(collection(firestore, `users/${userId}/workshopJoinRequests`)));
        data.forEach(async (data: QueryDocumentSnapshot) => {
            result.push({ id: data.id, ...data.data() } as WorkshopRequest)
        })
        return result;
    }

    /**
     * The function `getWorkshopByUserID` retrieves a list of workshops associated with a specific user
     * ID.
     * @param {string} userId - The `userId` parameter is a string that represents the unique
     * identifier of a user.
     * @returns The function `getWorkshopByUserID` returns a Promise that resolves to an array of
     * `UserWorkshops` objects.
     */
    const getWorkshopByUserID = async (userId: string) => {
        const result: UserWorkshops[] = []
        const data = await getDocs(query(collection(firestore, `users/${userId}/workshops`)));
        data.forEach(async (data: QueryDocumentSnapshot) => {
            result.push({ id: data.id, ...data.data() } as UserWorkshops)
        })
        return result;
    }

    /**
     * The function retrieves participants for a specific workshop ID from a Firestore database.
     * @param {string} workshopId - The `workshopId` parameter is a string that represents the ID of a
     * workshop.
     * @returns an array of WorkshopRequest objects.
     */
    const getParticipantsByWorkshopID = async (workshopId: string) => {
        const result: WorkshopRequest[] = []
        const data = await getDocs(query(collection(firestore, `workshops/${workshopId}/participants`)));
        data.forEach(async (data: QueryDocumentSnapshot) => {
            result.push({ id: data.id, ...data.data() } as WorkshopRequest)
        })
        return result;
    }

    /**
     * The `onDelete` function deletes a workshop and associated user data from Firestore and displays
     * a success or error toast message.
     * @param {string} workshopId - The `workshopId` parameter is a string that represents the unique
     * identifier of the workshop that is being deleted.
     * @param {string} workshop_manager_id - The `workshop_manager_id` parameter in the `onDelete`
     * function represents the unique identifier of the workshop manager associated with the workshop
     * that is being deleted. This ID is used to locate and delete the workshop from the specific
     * user's list of workshops in the Firestore database.
     * @param {Function} onEnd - The `onEnd` parameter in the `onDelete` function is a callback
     * function that is called after the deletion operation is completed, whether it succeeds or fails.
     * It is used to perform any additional actions or cleanup tasks after the deletion process is
     * done.
     */
    const onDelete = async (workshopId: string, workshop_manager_id: string, onEnd: Function) => {
        runTransaction(firestore, async (transaction) => {
            transaction.delete(doc(firestore, `workshops/${workshopId}`))
            transaction.delete(doc(firestore, `users/${workshop_manager_id}/workshops/${workshopId}`))
        }).then(() => toast({
            title: 'Workshop deleted!',
            status: "success",
            isClosable: true
        })).catch(() => toast({
            title: 'Please try again later!',
            status: "error",
            isClosable: true
        })).finally(() => {
            onEnd()
        })
    }

    return {
        onDelete,
        getWorkshops,
        getWorkshopRequestsByUserID,
        getWorkshopByUserID,
        getParticipantsByWorkshopID
    }
}

export default useWorkshop