import { CheckIcon } from "@chakra-ui/icons"
import { useBoolean, Flex, List, ListItem, Text } from "@chakra-ui/react"
import { FC } from "react"
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"
import { ITask } from "../../../Interface"

const AdminTaskItem: FC<{ item: ITask }> = ({ item }) => {

    const [clicked, {toggle: toggleClick}] = useBoolean(false)
  
    return (
        <Flex bg="gray.100" p="1rem" w="100%" borderRadius="0.5rem" align="flex-start" justify="space-between" direction="column">
            <Flex w="100%" justify="space-between" onClick={toggleClick} cursor="pointer">
                <Text fontWeight={600} fontSize="18px">{item.name}</Text>
                {clicked ? <MdKeyboardArrowUp size="32px" /> : <MdKeyboardArrowDown size="32px" />}
            </Flex>
            {clicked && (
                <Flex direction="column" gap="1rem">
                    <Text>
                      {item.description}
                    </Text>
                    {item.controlList && (
                      <List>
                        {item.controlList.map(item => (
                          <ListItem key={item.id} display="flex" gap="0.3rem" alignItems="center">
                            <CheckIcon />
                            {item.name}
                        </ListItem>
                        ))}
                      </List>
                    )}
                </Flex>
            )}
        </Flex>
    )
  }

  export default AdminTaskItem