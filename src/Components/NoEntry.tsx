import { Flex, Text } from "@chakra-ui/react"
import { SCIcon } from "./SCElements"

const NoEntry = (props: any) => {
    return (
      <Flex zIndex={999} width={"95%"} bgColor={"white"} height={props.type === "community" ? "fit-content" : "50vh"} direction={"column"} alignItems={"center"} justifyContent={"center"} gap={4} borderRadius={4} p={"2rem"}>
        <SCIcon
          name='no-entry'
          width={300}
          height={300}
          cssClass="NoEntry"
        />
        <Text fontSize={24} fontWeight={"bold"} color={"blue.800"}>
          No {props.type}, yet!
        </Text>
      </Flex>
    )
}

export default NoEntry