import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useSupportGroup } from '../Hooks'
import { ISupportGroup } from '../Interface'

const SupportGroupDetailPage = () => {
  const params = useParams()
  const {getSupportGroupBySlug} = useSupportGroup()
  const [supportGroup, setSupportGroup] = useState<ISupportGroup>()
  
  useEffect(() => {
    if(params.slug) {
      getSupportGroupBySlug(params.slug)
        .then(group => !!group && setSupportGroup(group))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <PageLayout leftWidth='100%'>
      <Flex w="100%" bg="white" direction="column" align="flex-start" p="1rem">
        <Text>
          SupportGroupDetailPage
        </Text>
        <Text>
          {supportGroup && supportGroup.support_group_name}
        </Text>
      </Flex>
      <></>
    </PageLayout>
  )
}

export default SupportGroupDetailPage
