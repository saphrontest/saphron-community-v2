 import { FC, Fragment, useEffect, useState } from "react";
import { Workshop, WorkshopRequest } from "../../Interface/WorkshopInterface";
import { useBoolean, Flex, Divider, Spinner, Text, Image, Box, Button, useToast } from "@chakra-ui/react";
import { doc, runTransaction, updateDoc } from "firebase/firestore";
import moment from "moment";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { getWorkshopJoinRequests } from "../../Helpers";
import { firestore } from "../../firebaseClient";
import ParticipantItem from "./ParticipantItem";
import { EditWorkshopModal } from "../Modals";
import { DeleteAlert } from "../Platform";
import { IStatus } from "../../Interface/StatusInterface";

interface MyWorkshopItemProps {
    idx: number;
    workshop: Workshop;
    toggleReloadWorkshops: () => void;
}

const MyWorkshopItem: FC<MyWorkshopItemProps> = ({ workshop, idx, toggleReloadWorkshops }) => {

    const toast = useToast()
    const [isClicked, setIsClicked] = useBoolean(false)
    const [isLoading, setIsLoading] = useBoolean(false)
    const [isEditOpen, setEditOpen] = useBoolean(false)
    const [isDeleteOpen, setDeleteOpen] = useBoolean(false)
    const [participantsLoading, setParticipantsLoading] = useState(false)
    const [participants, setParticipants] = useState<WorkshopRequest[]>()
    
    useEffect(() => {
        if (isClicked) {
            setParticipantsLoading(true)
            getWorkshopJoinRequests(workshop.id)
                .then(result => result && setParticipants(result))
                .finally(() => setParticipantsLoading(false))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClicked])

    const handleButton = async (
        event: any,
        requestId: string,
        status: IStatus
    ) => {
        event.stopPropagation()
        setIsLoading.toggle()
        const joinDocRef = doc(firestore, `workshops/${workshop.id}/participants/${requestId}`)
        updateDoc(joinDocRef, { status, updatedAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss") })
            .finally(() => {
                getWorkshopJoinRequests(workshop.id)
                    .then(result => result && setParticipants(result))
                    .finally(() => setIsLoading.toggle())
            })
    }

    const handleDelete = async () => {
        setIsLoading.toggle()
        runTransaction(firestore, async (transaction) => {
            transaction.delete(doc(firestore, `workshops/${workshop.id}`))
            transaction.delete(doc(firestore, `users/${workshop.workshop_manager_id}/workshops/${workshop.id}`))
        }).then(() => toast({
            title: 'Workshop deleted!',
            status: "success",
            isClosable: true,
            position: "top-right"
        })).catch(() => toast({
            title: 'Please try again later!',
            status: "error",
            isClosable: true,
            position: "top-right"
        })).finally(() => {
            setIsLoading.toggle()
            setDeleteOpen.toggle()
            toggleReloadWorkshops()
        })
    }

    return (
        <>
            <Flex direction="column" align="flex-start" p="1rem" bg="gray.50" borderRadius="1rem" w="100%" onClick={setIsClicked.toggle}>
                <Flex w="100%" justify="space-between" align="center" cursor="pointer">
                    <Flex direction="row" align="center">
                        <Text fontWeight={600} mr="1rem">#{idx + 1}</Text>
                        <Image src={workshop.cover_img} w="7rem" h="5rem" mr="1rem" borderRadius="1rem" />
                        <Box>
                            <Text textAlign="left" fontWeight="600" fontSize={["12", "18"]} noOfLines={2}>{workshop.workshop_name}</Text>
                            <Text textAlign="left" fontSize={["12", "16"]}>{moment(new Date(workshop.createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
                        </Box>
                    </Flex>
                    {!isClicked ? <MdKeyboardArrowDown size={24} /> : participantsLoading ? <Spinner /> : <MdKeyboardArrowUp size={24} />}
                </Flex>
                {isClicked && !isLoading ? (
                    <>
                        {
                            !participantsLoading && (
                                <Flex direction="column" w="100%" align="flex-start" gap="1rem" p="1rem" onClick={ev => ev.stopPropagation()}>
                                    <Divider borderColor="gray" />
                                    <Box>
                                        <Text textAlign="left" fontStyle="italic" fontSize={["12", "16"]}>{workshop.short_description}</Text>
                                        <Text textAlign="left" fontSize={["12", "16"]} fontWeight="600" mt="1rem" dangerouslySetInnerHTML={{ __html: workshop.detailed_description }} />
                                    </Box>
                                    <Divider borderColor="gray" />
                                    <Box w="100%">
                                        {!!participants?.length ? <Text fontSize={["12", "16"]} fontWeight={600} pb="1rem" textAlign="left">Join Requests</Text> : <Text fontSize={["12", "16"]}>No join request, yet!</Text>}
                                        <Flex w="100%" direction="column" gap="1rem">
                                            {participants?.map(participant => (
                                                <Fragment key={participant.id} >
                                                    <ParticipantItem participant={participant} isLoading={isLoading} handleButton={handleButton} />
                                                </Fragment>
                                            ))}
                                        </Flex>
                                    </Box>
                                    <Divider borderColor="gray" />
                                    <Flex gap="1rem" w="100%" align="center" justify="center">
                                        <Button onClick={(ev) => {
                                            ev.stopPropagation()
                                            setEditOpen.toggle()
                                        }}
                                        fontSize={["12", "16"]}
                                        >Edit Workshop</Button>
                                        <Button variant="outline" fontSize={["12", "16"]} onClick={(ev) => {
                                            ev.stopPropagation()
                                            setDeleteOpen.toggle()
                                        }}>Delete Workshop</Button>
                                    </Flex>
                                </Flex>
                            )
                        }
                    </>
                ) : null}
            </Flex>
            <EditWorkshopModal isOpen={isEditOpen} toggleModal={() => setEditOpen.toggle()} workshop={workshop} />
            <DeleteAlert isOpen={isDeleteOpen} toggleDialog={() => setDeleteOpen.toggle()} handleDelete={handleDelete} label={`${workshop.workshop_name} Workshop`} />
        </>
    )
}

export default MyWorkshopItem