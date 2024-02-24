import { Flex, Text, useBoolean } from "@chakra-ui/react"
import { PageLayout } from "../Layouts"
import { JoinedWorkshops, Meta, MyWorkshopItem, RequestedWorkshops } from "../Components"
import React, { useEffect, useState } from "react"
import { UserWorkshops, Workshop, WorkshopRequest, IUser } from "../Interface"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useMediaQuery } from '@chakra-ui/react'
import { useWorkshop } from "../Hooks"

const MyWorkshopsPage = () => {

  const { getWorkshops, getWorkshopRequestsByUserID, getWorkshopByUserID } = useWorkshop()
  const user: IUser = useSelector((state: RootState) => state.user)
  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')

  const [workshops, setWorkshops] = useState<Workshop[]>()
  const [userWorkshops, setUserWorkshops] = useState<UserWorkshops[]>()
  const [requestedWorkshops, setRequestedWorkshops] = useState<WorkshopRequest[]>()
  const [joinWorkshops, setJoinWorkshops] = useState<Workshop[]>([])
  const [reloadWorkshops, setReloadWorkshops] = useBoolean(false)


  const getAllWorkshops = () => {

    getWorkshops()
      .then(result => result && setWorkshops(result))

    getWorkshopRequestsByUserID(user.id)
      .then((result: WorkshopRequest[]) => {
        result.length && setRequestedWorkshops(result)
      })

    getWorkshopByUserID(user.id)
      .then(result => result.length && setUserWorkshops(result))

  }

  const checkParticipantStatus = (workshop: Workshop) => {
    return workshop.participants.some(participant => participant.userId === user.id && participant.status === "confirmed")
  }

  useEffect(() => {
    getAllWorkshops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!reloadWorkshops) return;
    getAllWorkshops()
    return () => setReloadWorkshops.toggle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadWorkshops])



  useEffect(() => {

    workshops?.forEach(workshop => {

      if (!!requestedWorkshops?.length) {
        requestedWorkshops.forEach(requested => {
          if (requested.workshopId === workshop.id && checkParticipantStatus(workshop)) {
            setJoinWorkshops(prev => ([workshop, ...prev]));
          }
        })

      }

      if (!!userWorkshops?.length) {
        userWorkshops.forEach(userW => {
          if (userW.workshopId === workshop.id && workshop.status === "confirmed") {
            setJoinWorkshops(prev => ([workshop, ...prev]));
          }
        })
      }

    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedWorkshops, userWorkshops, workshops])

  return (
    <>
      <PageLayout showSidebar={false} leftWidth="70%">
        <>
          <Meta
            title={'Saphron Health | My Workhops'}
            description="My Workhops"
          />
          <Flex gap="1rem">
            <RequestedWorkshops
              newWorkshopRequests={userWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[] ?? []}
              joinRequests={requestedWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)) as Workshop[] ?? []}
            />
            <Flex direction="column" gap="1rem">
              {isSmallerThan766 && <JoinedWorkshops joinWorkshops={joinWorkshops} />}
              <Flex bg="white" flex={1} p="1rem" direction="column" align="flex-start" h="fit-content">
                <Text fontSize="22" fontWeight={600} pb="1rem">
                  My Workshops
                </Text>
                <Flex gap="1rem" direction="column" w="100%">
                  {userWorkshops?.map(workshop => workshops?.find(w => w.id === workshop.workshopId)).map((workshop, idx) => workshop && (
                    <React.Fragment key={idx}>
                      <MyWorkshopItem idx={idx} workshop={workshop} toggleReloadWorkshops={() => setReloadWorkshops.toggle()} />
                    </React.Fragment>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
        <>
          {(!!joinWorkshops && !isSmallerThan766) && <JoinedWorkshops joinWorkshops={joinWorkshops} />}
        </>
      </PageLayout>
    </>
  )
}

export default MyWorkshopsPage