import { useBoolean, Flex, Button, Text, Box, useMediaQuery } from "@chakra-ui/react";
import { runTransaction, Transaction, doc } from "firebase/firestore";
import { FC, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import { IPlatform } from "../../../Interface";
import { InputItem } from "../../../Layouts";
import { firestore } from "../../../firebaseClient";
import { MdCancel } from "react-icons/md";

const RewardItem: FC<{
    id: string;
    slug: string;
    platform: IPlatform;
    reward: number;
    toggleReloadRewards: () => void
}> = ({
    id, platform, slug, reward, toggleReloadRewards
}) => {

        const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
        const [newReward, setNewReward] = useState("")
        const [isEdit, { toggle: toggleIsEdit }] = useBoolean(false)

        const updateReward = (id: string, rewardEdit: number) => {
            runTransaction(firestore, async (tx: Transaction) => {
                tx.update(doc(firestore, `rewards/${id}`), { reward: rewardEdit })
            }).then(() => {
                toggleReloadRewards()
                toggleIsEdit()
            })
        }

        const Mobile = () => {
            return (
                <Flex bg="gray.100" p="1rem" borderRadius="1rem" justify="space-between">

                    <Flex direction="column" align="flex-start">
                        <Text align="left">{platform}.<strong>{slug}</strong></Text>
                        {isEdit ? (
                            <Flex gap="1rem">
                                <Flex align="center">
                                    <InputItem name='point' value={newReward} type="number" onChange={ev => setNewReward(ev.target.value)} />
                                    <Text>p</Text>
                                </Flex>
                                <Flex gap="0.5rem">
                                    <Button w="16px" padding="0.1rem" minH="16px" onClick={() => updateReward(id, +newReward)}>
                                        <FaCheck />
                                    </Button>
                                    <Button w="16px" padding="0.1rem" minH="16px" bg="red.600" onClick={toggleIsEdit}>
                                        <MdCancel />
                                    </Button>
                                </Flex>
                            </Flex>
                        ) : (
                            <Text fontWeight={800}>{reward}p</Text>
                        )}
                    </Flex>
                    {!isEdit && (<Flex
                        w="40px"
                        h="40px"
                        p="0.4rem"
                        bg="blue.500"
                        align="center"
                        justify="center"
                        cursor="pointer"
                        borderRadius="50%"
                        onClick={toggleIsEdit}
                    >
                        <TiEdit fill='white' size="24px" />
                    </Flex>)}
                </Flex>
            )
        }


        if (isSmallerThan766) {
            return <Mobile />
        }

        return (
            <Flex bg="gray.100" p="1rem" borderRadius="1rem" justify="space-between">
                <Text align="left">{platform}.<strong>{slug}</strong></Text>
                <Flex align="center" gap="1rem">
                    {!isEdit ? (
                        <>
                            <Text fontWeight={600}>{reward}p</Text>
                            <Box bg="blue.500" p="0.4rem" borderRadius="1rem" cursor="pointer" onClick={toggleIsEdit}>
                                <TiEdit fill='white' />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Flex align="center" gap="0.2rem">
                                <InputItem name='point' type="number" onChange={ev => setNewReward(ev.target.value)} />
                                <Text>p</Text>
                            </Flex>
                            <Button px="0.2rem" onClick={() => updateReward(id, +newReward)}>
                                <FaCheck size="20px" />
                            </Button>
                            <Button px="0.2rem" bg="red.600" onClick={toggleIsEdit}>
                                <MdCancel size="24px" />
                            </Button>
                        </>
                    )}
                </Flex>
            </Flex>
        )

    }

export default RewardItem