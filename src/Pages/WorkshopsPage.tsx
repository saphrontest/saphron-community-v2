import { PlatformPageLayout } from '../Layouts'
import { useToast } from '@chakra-ui/react'
import communitiesBackground from '../assets/images/communities.jpg'
import { Meta, WorkshopDetail, WorkshopList } from '../Components'
import { useEffect, useState } from 'react'
import { Workshop, WorkshopRequest, IUser } from '../Interface'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { createSlug } from '../Helpers'
import { RootState } from '../redux/store'
import { useParams } from 'react-router-dom'
import { useWorkshop } from '../Hooks'

const WorkshopsPage = () => {

  const params = useParams()
  const dispatch = useDispatch()
  const toast = useToast()
  const { getWorkshops, getWorkshopRequestsByUserID } = useWorkshop()
  
  const [selected, setSelected] = useState<Workshop | undefined>()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [workshopRequests, setWorkshopRequests] = useState<WorkshopRequest[]>()

  const user: IUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    getWorkshops()
      .then(result => result.length && setWorkshops(result))
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
      getWorkshopRequestsByUserID(user.id)
        .then((res: WorkshopRequest[]) => res.length && setWorkshopRequests(res))
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
      actionButtonText="Wanna be workshop manager?"
      actionButtonOnClick={actionButtonOnClick}
    >
      <Meta
        title={`Saphron Health | Workshops`}
        description='Workshops'
      />
      <WorkshopList setSelected={setSelected} workshops={workshops} selected={selected}/>
      <WorkshopDetail selected={selected} isRequested={!!workshopRequests?.some((workshop: WorkshopRequest) => workshop?.workshopId === selected?.id)} />
    </PlatformPageLayout>

  )
}

export default WorkshopsPage
