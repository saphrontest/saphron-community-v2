import { Flex, Text, useBoolean } from "@chakra-ui/react"
import { PageLayout } from "../Layouts"
import { JoinedWorkshops, MyWorkshopItem, RequestedWorkshops } from "../Components"
import React, { useEffect, useState } from "react"
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
  const [reloadWorkshops, setReloadWorkshops] = useBoolean(false)


  useEffect(() => {

    getWorkshops()
      .then(result => result && setWorkshops(result))

    getUserWorkshopRequestList(user.id)
      .then(result => result && setRequestedWorkshops(result))

    getUserWorkshops(user.id)
      .then(result => result && setUserWorkshops(result))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {

    if(!reloadWorkshops) return;

    getWorkshops()
      .then(result => result && setWorkshops(result))

    getUserWorkshopRequestList(user.id)
      .then(result => result && setRequestedWorkshops(result))

    getUserWorkshops(user.id)
      .then(result => result && setUserWorkshops(result))

    return () => setReloadWorkshops.toggle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadWorkshops])

  useEffect(() => {

    workshops?.forEach(workshop => {

      if (!!requestedWorkshops?.length) {
        requestedWorkshops.forEach(requested => {
          if (requested.workshopId === workshop.id && requested.status === "confirmed") {
            setJoinWorkshops(prev => ([...prev, workshop]))
          }
        })
      }

      if (!!userWorkshops?.length) {
        userWorkshops.forEach(userW => {
          if (userW.id === workshop.id && workshop.status === "confirmed") {
            setJoinWorkshops(prev => ([...prev, workshop]))
          }
        })
      }

    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedWorkshops, userWorkshops])

  return (
    <>
      <PageLayout showSidebar={false} leftWidth="70%">
        <>
          <Flex gap="1rem">
            <RequestedWorkshops
              newWorkshopRequests={userWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[] ?? []}
              joinRequests={requestedWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[] ?? []}
            />
            <Flex bg="white" flex={1} p="1rem" direction="column" align="flex-start">
              <Text fontSize="22" fontWeight={600} pb="1rem">
                My Workshops
              </Text>
              <Flex gap="1rem" direction="column" w="100%">
                {userWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)).map((workshop, idx) => (workshop && workshop.status === "confirmed") && (
                  <React.Fragment key={idx}>
                    <MyWorkshopItem idx={idx} workshop={workshop} toggleReloadWorkshops={() => setReloadWorkshops.toggle()}/>
                  </React.Fragment>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </>
        <>
          {!!joinWorkshops && <JoinedWorkshops joinWorkshops={joinWorkshops} />}
        </>
      </PageLayout>
    </>
  )
}

export default MyWorkshopsPage