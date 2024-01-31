import { Flex } from "@chakra-ui/react"
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
                requestedWorkshops={
                  userWorkshops
                    .map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[]
                }
              />
          }
          <Flex bg="white" flex={1}>MAIN</Flex>
        </Flex>
      </>
      <>
        {
          !!requestedWorkshops &&
            <JoinedWorkshops
              joinWorkshops={
                requestedWorkshops
                  .map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[]
              }
            />
        }
      </>
    </PageLayout>
  )
}

export default MyWorkshopsPage