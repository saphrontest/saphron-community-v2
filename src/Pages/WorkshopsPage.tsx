import { PlatformPageLayout } from '../Layouts'
import { useMediaQuery, useToast } from '@chakra-ui/react'
import communitiesBackground from '../assets/images/communities.jpg'
import { WorkshopDetail, WorkshopList } from '../Components'
import { useEffect, useState } from 'react'
import { Workshop, WorkshopRequest } from '../Interface/WorkshopInterface'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { createSlug, getUserWorkshopRequestList, getWorkshops } from '../Helpers'
import { UserInterface } from '../Interface/UserInterface'
import { RootState } from '../redux/store'
import { useParams } from 'react-router-dom'

const WorkshopsPage = () => {

  const params = useParams()
  const dispatch = useDispatch()
  const toast = useToast()

  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')

  const [selected, setSelected] = useState<Workshop | undefined>()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [workshopRequests, setWorkshopRequests] = useState<WorkshopRequest[]>()

  const user: UserInterface = useSelector((state: RootState) => state.user)

  useEffect(() => {
    getWorkshops()
      .then(result => result && setWorkshops(result))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!!selected === false) {
      if (params.slug) {
        setSelected(workshops.find(workshop => createSlug(workshop.workshop_name) === params.slug))
      } else {
        setSelected(workshops[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshops])

  useEffect(() => {
    if (user.id) {
      getUserWorkshopRequestList(user.id)
        .then((res: WorkshopRequest[] | false) => res && setWorkshopRequests(res))
    } else {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const actionButtonOnClick = () => {
    if (user.id) {
      dispatch(setModal({ isOpen: true, view: "createWorkshop" }))
    } else {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
    }
  }

  return (
    <PlatformPageLayout
      title="Workshops"
      coverImg={communitiesBackground}
      actionButtonText="I wan’t to be a workshop manager!"
      actionButtonOnClick={actionButtonOnClick}
    >
      {isSmallerThan766 ? (
        <WorkshopList.Mobile workshops={workshops} />
      ) : (
        <>
          <WorkshopList.Desktop selected={selected} setSelected={setSelected} workshops={workshops} />
          <WorkshopDetail selected={selected} isRequested={!!workshopRequests?.some((workshop: WorkshopRequest) => workshop?.workshopId === selected?.id)} />
        </>
      )}
    </PlatformPageLayout>

  )
}

export default WorkshopsPage
