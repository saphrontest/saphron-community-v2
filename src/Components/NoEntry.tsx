import { Flex, Text } from "@chakra-ui/react"
import { SCIcon } from "./SCElements"

const NoEntry = (props: any) => {
    return (
        <Flex width={"100%"} bgColor={"white"} height={"50vh"} direction={"column"} alignItems={"center"} justifyContent={"center"} gap={4} borderRadius={4}>
        <SCIcon
          name='no-entry'
          width={300}
          height={300}
          cssClass="NoEntry"
        />
        <Text fontSize={24} fontWeight={"bold"} color={"blue.800"}>
          No {props.type},yet!
        </Text>
      </Flex>
    )
}

export default NoEntry