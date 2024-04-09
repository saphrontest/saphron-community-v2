import { useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Text } from '@chakra-ui/react'
import { Account, Products } from '../Components'
const RewardsPage = () => {
    const [view, setView] = useState<"products" | "account">("products")

  return (
    <PageLayout leftWidth='100%' showSidebar={false}>
        <Flex gap="1rem" direction={["column", "column", "row"]}>
            <Flex
            p="1rem"
            bg="white"
            gap="0.5rem"
            h="fit-content"
            borderRadius="0.4rem"
            direction={["row", "row", "column"]}
            >
                <Flex
                flex={1}
                p="0.4rem"
                align="center"
                justify="center"
                cursor="pointer"
                borderRadius="5px" 
                _hover={{bg: "gray.200"}}
                onClick={() => setView("products")}
                bg={view === "products" ? "gray.300" : "gray.100"}
                >
                    <Text
                    w="100%"
                    textAlign={["center", "center", "left"]}
                    fontWeight="600"
                    mr={{ md: "2rem" }}
                    >
                        Products
                    </Text>
                </Flex>
                <Flex
                flex={1}
                p="0.4rem"
                align="center"
                justify="center"
                cursor="pointer"
                borderRadius="5px" 
                _hover={{bg: "gray.200"}}
                onClick={() => setView("account")}
                bg={view === "account" ? "gray.300" : "gray.100"}
                >
                    <Text
                    w="100%"
                    textAlign={["center", "center", "left"]}
                    fontWeight="600"
                    mr={{ md: "2rem" }}
                    >
                        Account History
                    </Text>
                </Flex>
            </Flex>
            {view === "account" ? <Account /> : <Products />}
        </Flex>
        <></>
    </PageLayout>
  )
}

export default RewardsPage
