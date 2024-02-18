import { Flex, FormControl, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

const PlatformFormItem: FC<{
    children: ReactNode;
    label: string;
    isOptional?: boolean;
    description?: string;
    isFormElement?: boolean;
    error?: boolean;
    errorMessage?: string;
}> = ({ children, label, isOptional = false, description, isFormElement = true, error, errorMessage }) => {
    return (
        <Flex gap="0.3rem" direction="column" w="100%" pb={"0.4rem"}>
            <Flex gap="0.4rem" align="center">
                <Text fontWeight="600">{label}</Text>
                {isOptional && <Text fontSize="12px" color="gray" fontStyle="italic">Optional</Text>}
                {error && <Text fontSize="12px" color="red" fontStyle="italic">{errorMessage}</Text>}
            </Flex>
            <Text fontSize="14px" color="gray">
                {description}
            </Text>
            {isFormElement ? (
                <FormControl>
                    {children}
                </FormControl>
            ) : children}
        </Flex>
    )
}

export default PlatformFormItem
