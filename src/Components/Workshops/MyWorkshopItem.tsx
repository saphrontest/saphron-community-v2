import { FC, Fragment, useEffect, useState } from "react";
import { Workshop, WorkshopRequest } from "../../Interface/WorkshopInterface";
import { useBoolean, Flex, Text, Spinner } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { firestore } from "../../firebaseClient";
import { EditWorkshopModal } from "../Modals";
import { MyPlatformItem } from "../Platform";
import { IStatus } from "../../Interface/StatusInterface";
import { useWorkshop } from "../../Hooks";
import {PlatformParticipantItem} from "../Platform";

interface MyWorkshopItemProps {
    idx: number;
    workshop: Workshop;
    toggleReloadWorkshops: () => void;
}

const MyWorkshopItem: FC<MyWorkshopItemProps> = ({ workshop, idx, toggleReloadWorkshops }) => {

    const { getParticipantsByWorkshopID, onDelete } = useWorkshop()
    const [isClicked, setIsClicked] = useBoolean(false)
    const [isLoading, setIsLoading] = useBoolean(false)
    const [isEditOpen, setEditOpen] = useBoolean(false)
    const [participantsLoading, setParticipantsLoading] = useState(false)
    const [participants, setParticipants] = useState<WorkshopRequest[]>()

    useEffect(() => {
        if (isClicked) {
            setParticipantsLoading(true)
            getParticipantsByWorkshopID(workshop.id)
                .then(result => result.length && setParticipants(result))
                .finally(() => setParticipantsLoading(false))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClicked])

    const handleRequestButton = async (
        event: any,
        requestId: string,
        status: IStatus
    ) => {
        event.stopPropagation()
        setIsLoading.toggle()
        const joinDocRef = doc(firestore, `workshops/${workshop.id}/participants/${requestId}`)
        updateDoc(joinDocRef, { status, updatedAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss") })
            .finally(() => {
                getParticipantsByWorkshopID(workshop.id)
                    .then(result => result.length && setParticipants(result))
                    .finally(() => setIsLoading.toggle())
            })
    }

    return (
        <>
            <MyPlatformItem
                idx={idx}
                isLoading={isLoading}
                isClicked={isClicked}
                setClicked={() => setIsClicked.toggle()}
                handleDelete={async () => {
                    onDelete(
                        workshop.id,
                        workshop.workshop_manager_id,
                        () => {
                            setIsLoading.toggle()
                            toggleReloadWorkshops()
                        }
                    )
                }}
                openEditModal={() => setEditOpen.toggle()}
                item={{
                    name: workshop.workshop_name,
                    createdAt: workshop.createdAt,
                    cover_img: workshop.cover_img,
                    short_description: workshop.short_description,
                    detailed_description: workshop.detailed_description,
                    status: workshop.status
                }}
            >
                {
                    !participantsLoading ? (
                        <>
                            {!!participants?.length ? <Text fontSize={["12", "16"]} fontWeight={600} pb="1rem" textAlign="left">Join Requests</Text> : <Text fontSize={["12", "16"]}>No join request, yet!</Text>}
                            <Flex w="100%" direction="column" gap="1rem">
                                {participants?.map(participant => (
                                    <Fragment key={participant.id} >
                                        <PlatformParticipantItem participant={participant} isLoading={isLoading} handleRequestButton={handleRequestButton} />
                                    </Fragment>
                                ))}
                            </Flex>
                        </>
                    ) : <Spinner />
                }
            </MyPlatformItem>
            {isEditOpen && <EditWorkshopModal isOpen={isEditOpen} toggleModal={() => setEditOpen.toggle()} workshop={workshop} />}
        </>
    )
}

export default MyWorkshopItem