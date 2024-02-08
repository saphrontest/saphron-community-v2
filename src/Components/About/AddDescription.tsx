import { FC } from "react";
import { InputItem } from "../../Layouts";
import { Flex, Button, Text, Box } from "@chakra-ui/react";

const AddDescription: FC<{
  addDescriptionView: boolean;
  addDescription: () => void;
  setAddDescriptionView: (arg: boolean) => void;
  setDescriptionText: (arg: string) => void;
}> = ({
  addDescription,
  addDescriptionView,
  setDescriptionText,
  setAddDescriptionView
}) => {
    const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const text = ev.target.value
      !!text && setDescriptionText(text)
    }
    return !addDescriptionView ? (
      <Box
        bg="gray.100"
        width="100%"
        p={2}
        borderRadius={4}
        border="1px solid"
        borderColor="gray.300"
        cursor="pointer"
        onClick={() => setAddDescriptionView(!addDescriptionView)}
      >
        <Text fontSize="9pt" fontWeight={700} color="blue.500">
          Add description
        </Text>
      </Box>
    ) : (
      <>
        <InputItem
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleInput}
        />
        <Flex justify="flex-end" mt={"0.4rem"}>
          <Button onClick={addDescription} height="30px" w="fit-content">
            <Text>Add</Text>
          </Button>
        </Flex>
      </>
    )
  }

export default AddDescription