import { Flex, Divider, Button, Box, Text, Image, useBoolean } from '@chakra-ui/react'
import moment from 'moment'
import { FC, ReactNode } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import DeleteAlert from './DeleteAlert';

interface IMyPlatformItem {
    name: string;
    createdAt: string;
    cover_img: string;
    short_description?: string;
    detailed_description?: string;
    description?: string;
    status: string;
}

interface IMyPlatformItemProps {
    item: IMyPlatformItem;
    openEditModal: () => void;
    idx: number;
    children: ReactNode;
    isClicked: boolean;
    isLoading: boolean;
    setClicked: () => void;
    handleDelete: () => Promise<void>;
}

const RightIcon: FC<{isClicked: boolean}> = ({isClicked}) => !isClicked ? <MdKeyboardArrowDown size={24} /> : <MdKeyboardArrowUp size={24} />

const MyPlatformItem: FC<IMyPlatformItemProps> = ({
    idx,
    item,
    isLoading,
    isClicked,
    setClicked,
    openEditModal,
    children: participants,
    handleDelete
}) => {
    const [isDeleteOpen, setDeleteOpen] = useBoolean(false)
    return (
        <>
            <Flex direction="column" align="flex-start" p="1rem" bg="gray.50" borderRadius="1rem" w="100%" onClick={item.status !== "rejected" ? setClicked : undefined}>
                <Flex w="100%" justify="space-between" align="center" cursor="pointer">
                    <Flex direction="row" align="center">
                        <Text fontWeight={600} mr="1rem">#{idx + 1}</Text>
                        <Image src={item.cover_img} w="7rem" h="5rem" mr="1rem" borderRadius="1rem" />
                        <Box>
                            <Text textAlign="left" fontWeight="600" fontSize={["12", "18"]} noOfLines={2}>{item.name}</Text>
                            <Text textAlign="left" fontSize={["12", "16"]}>{moment(new Date(item.createdAt)).format("DD.MM.YYYY hh:mm")}</Text>
                        </Box>
                    </Flex>
                    {item.status === "rejected" ? (
                        <Box bg="red.500" color="white" p="0.5rem 1rem" borderRadius="1rem" fontWeight={600}>Rejected</Box>
                    ) : <RightIcon isClicked={isClicked}/>}
                </Flex>
                {isClicked && !isLoading ? (
                    <>
                        {
                            <Flex direction="column" w="100%" align="flex-start" gap="1rem" p="1rem" onClick={ev => ev.stopPropagation()}>
                                <Divider borderColor="gray" />
                                <Box>
                                    {item.short_description && <Text textAlign="left" fontStyle="italic" fontSize={["12", "16"]}>{item.short_description}</Text>}
                                    {item.detailed_description && <Text textAlign="left" fontSize={["12", "16"]} fontWeight="600" mt="1rem" dangerouslySetInnerHTML={{ __html: item.detailed_description }} />}
                                    {item.description && <Text textAlign="left" fontSize={["12", "16"]} fontWeight="600" mt="1rem" dangerouslySetInnerHTML={{ __html: item.description }} />}
                                </Box>
                                <Divider borderColor="gray" />
                                <Box w="100%">
                                    {participants}
                                </Box>
                                <Divider borderColor="gray" />
                                <Flex gap="1rem" w="100%" align="center" justify="center">
                                    <Button onClick={(ev) => {
                                        ev.stopPropagation()
                                        openEditModal()
                                    }}
                                        fontSize={["12", "16"]}
                                    >Edit Workshop</Button>
                                    <Button variant="outline" fontSize={["12", "16"]} onClick={(ev) => {
                                        ev.stopPropagation()
                                        setDeleteOpen.toggle()
                                    }}>Delete Workshop</Button>
                                </Flex>
                            </Flex>
                        }
                    </>
                ) : null}
            </Flex>
            {
                isDeleteOpen && <DeleteAlert
                    isOpen={isDeleteOpen}
                    toggleDialog={() => setDeleteOpen.toggle()}
                    handleDelete={() => {
                        handleDelete()
                            .finally(() => setDeleteOpen.toggle())
                    }}
                    label={item.name} />
            }
        </>
    )
}

export default MyPlatformItem
