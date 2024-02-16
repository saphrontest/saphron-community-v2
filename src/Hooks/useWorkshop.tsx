import { QueryDocumentSnapshot, collection, getDocs, query } from "firebase/firestore";
import { UserWorkshops, Workshop, WorkshopRequest } from "../Interface/WorkshopInterface";
import { firestore } from "../firebaseClient";

const useWorkshop = () => {

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
            result.push(data.data() as WorkshopRequest)
        })
        return result;
    }

    // TODO: onCreate && onEdit && onDelete && onJoin

    return {
        getWorkshops,
        getWorkshopRequestsByUserID,
        getWorkshopByUserID,
        getParticipantsByWorkshopID
    }
}

export default useWorkshop