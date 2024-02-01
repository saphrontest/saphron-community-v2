import { Flex, Text } from "@chakra-ui/react"
import { PageLayout } from "../Layouts"
import { JoinedWorkshops, RequestedWorkshops } from "../Components"
import { useEffect, useState } from "react"
import { getUserWorkshopRequestList, getUserWorkshops, getWorkshops } from "../Helpers"
import { UserWorkshops, Workshop, WorkshopRequest } from "../Interface/WorkshopInterface"
import { UserInterface } from "../Interface/UserInterface"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

const MyWorkshopsPage = () => {

  const user: UserInterface = useSelector((state: RootState) => state.user)

  const [workshops, setWorkshops] = useState<Workshop[]>()
  const [userWorkshops, setUserWorkshops] = useState<UserWorkshops[]>()
  const [requestedWorkshops, setRequestedWorkshops] = useState<WorkshopRequest[]>()
  const [joinWorkshops, setJoinWorkshops] = useState<Workshop[]>([])

  useEffect(() => {

    workshops?.forEach(workshop => {

      if(!!requestedWorkshops?.length) {
        requestedWorkshops.forEach(requested => {
          if(requested.workshopId === workshop.id && requested.isConfirmed) {
            setJoinWorkshops(prev => ([...prev, workshop]))
          }
        })
      }

      if(!!userWorkshops?.length) {
        userWorkshops.forEach(userW => {
          if(userW.id === workshop.id && workshop.isVerified){
            setJoinWorkshops(prev => ([...prev, workshop]))
          }
        })
      }

    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedWorkshops, userWorkshops])

  useEffect(() => {

    getWorkshops()
      .then(result => result && setWorkshops(result))

    getUserWorkshopRequestList(user.id)
      .then(result => result && setRequestedWorkshops(result))

    getUserWorkshops(user.id)
      .then(result => result && setUserWorkshops(result))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageLayout showSidebar={false} leftWidth="70%">
      <>
        <Flex gap="1rem">
          {
            !!userWorkshops &&
              <RequestedWorkshops
                newWorkshopRequests={userWorkshops.map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[]}
                joinRequests={requestedWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[]}
              />
          }
          <Flex bg="white" flex={1} p="1rem" direction="column" align="flex-start">
            <Text fontSize="18" fontWeight={600}>
              Summary
            </Text>
          </Flex>
        </Flex>
      </>
      <>
        {!!joinWorkshops && <JoinedWorkshops joinWorkshops={joinWorkshops} />}
      </>
    </PageLayout>
  )
}

export default MyWorkshopsPage