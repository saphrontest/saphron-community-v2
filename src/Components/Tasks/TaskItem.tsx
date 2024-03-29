import { CheckIcon } from "@chakra-ui/icons";
import { useBoolean, Flex, Button, List, ListItem, Text, useToast, Spinner } from "@chakra-ui/react";
import { FC } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { ITask, IUser } from "../../Interface";
import { useTask } from "../../Hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const TaskItem: FC<{ item: ITask; }> = ({ item }) => {
    
    const toast = useToast()
    const { joinTask } = useTask()
    
    const [clicked, { toggle: toggleClick }] = useBoolean(false)
    const [loading, { toggle: toggleLoading }] = useBoolean(false)

    const user: IUser = useSelector((state: RootState) => state.user)

    const handleClick = async () => {
        toggleLoading()
        try {
            const success = await joinTask(user.id, item)
            !success && toast({
                title: "Please try again later!",
                status: "error",
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Please try again later!",
                status: "error",
                isClosable: true,
            })
        } finally {
            toggleLoading()
        }
    }

    return (
        <Flex bg="gray.100" p="1rem" w="100%" borderRadius="0.5rem" align="flex-start" justify="space-between" direction="column">
            <Flex w="100%" justify="space-between" onClick={toggleClick} cursor="pointer">
                <Text fontWeight={600} fontSize="18px">{item.name}</Text>
                <Flex align="center" gap="1rem">
                    <Button h="30px" onClick={(ev) => {
                        ev.stopPropagation()
                        handleClick()
                    }}>{loading ? <Spinner /> : "Start"}</Button>
                    {clicked ? <MdKeyboardArrowUp size="32px" /> : <MdKeyboardArrowDown size="32px" />}
                </Flex>
            </Flex>
            {clicked && (
                <Flex direction="column" gap="1rem" w="100%">
                    <Text textAlign="left">
                        {item.description}
                    </Text>
                    {item.controlList?.length ? <List>
                        {item.controlList.map(item => (
                            <ListItem key={item.id} display="flex" gap="0.3rem" alignItems="center">
                                <CheckIcon />
                                {item.name}
                            </ListItem>
                        ))}
                    </List>
                        : null}
                </Flex>
            )}
        </Flex>
    )
}

export default TaskItem