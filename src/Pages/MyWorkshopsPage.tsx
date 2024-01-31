import { Flex } from "@chakra-ui/react"
import { PageLayout } from "../Layouts"
import { JoinedWorkshops, RequestedWorkshops } from "../Components"

const MyWorkshopsPage = () => {
  return (
    <PageLayout showSidebar={false} leftWidth="70%">
      <>
        <Flex gap="1rem">
          <RequestedWorkshops />
          <Flex bg="white" flex={1}>
            MAIN
          </Flex>
        </Flex>
      </>
      <>
        <JoinedWorkshops />
      </>
    </PageLayout>
  )
}

export default MyWorkshopsPage