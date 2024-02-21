import { Input } from "@chakra-ui/react";
import React from "react";

type InputItemProps = {
  name: string;
  placeholder?: string;
  type: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mb?: number;
  bg?: string;
  size?: string;
  value?: string;
  disabled?: boolean;
};

const InputItem: React.FC<InputItemProps> = ({
  name,
  placeholder,
  type,
  onChange,
  mb,
  bg,
  size,
  value,
  disabled
}) => {
  return (
    <Input
      name={name}
      placeholder={placeholder}
      onInput={onChange}
      mb={mb}
      value={value}
      maxLength={9999}
      fontSize="10pt"
      _placeholder={{ color: "gray.500" }}
      _hover={{
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      _focus={{
        outline: "none",
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      bg={bg || "gray.50"}
      size={size}
      type={type}
      borderRadius={4}
      disabled={disabled}
    />
  );
};
export default InputItem;
