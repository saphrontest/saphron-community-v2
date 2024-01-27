import { PageLayout } from '../Layouts'
import { WorkshopSide } from '../Components'
import { Flex } from '@chakra-ui/react'

const WorkshopsPage = () => {
  
  return (
    <PageLayout showSidebar={false} leftWidth="90%">
      <>
        <Flex bg="white">
          Workshops
        </Flex>
      </>
      <>
        <WorkshopSide showButton={false}/>
      </>
    </PageLayout>
  )
}

export default WorkshopsPage
