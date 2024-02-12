import { PlatformPageLayout } from '../Layouts'
import { SupportGroupDetail, SupportGroupList } from '../Components'
import communitiesBackground from '../assets/images/communities.jpg'
import { useDispatch } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'

const SupportGroups = () => {
    const dispatch = useDispatch()
    return (
        <PlatformPageLayout
        title="Support Groups"
        coverImg={communitiesBackground}
        actionButtonText="Create group chat"
        actionButtonOnClick={() => dispatch(setModal({isOpen: true, view: 'createSupportGroup', data: ""}))}
        >
            <SupportGroupList />
            <SupportGroupDetail />
        </PlatformPageLayout>
    )
}

export default SupportGroups