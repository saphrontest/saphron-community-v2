import { PlatformPageLayout } from '../Layouts'
import { SupportGroupDetail, SupportGroupList } from '../Components'
import communitiesBackground from '../assets/images/communities.jpg'
import { useDispatch } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { useEffect, useState } from 'react'
import { useSupportGroup } from '../Hooks'
import { ISupportGroup } from '../Interface/SupportGroupInterface'

const SupportGroups = () => {
    const dispatch = useDispatch()
    const {getSupportGroups} = useSupportGroup()
    const [supportGroups, setSupportGroups] = useState<ISupportGroup[]>()
    const [selected, setSelected] = useState<ISupportGroup>()
    
    useEffect(() => {
        getSupportGroups()
            .then((result: ISupportGroup[]) => {
                result.length && setSupportGroups(result)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        console.log(supportGroups)
        if(!!supportGroups?.length && !selected) {
            setSelected(supportGroups[0])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supportGroups])
    
    return (
        <PlatformPageLayout
        title="Support Groups"
        coverImg={communitiesBackground}
        actionButtonText="Create group chat"
        actionButtonOnClick={() => dispatch(setModal({isOpen: true, view: 'createSupportGroup', data: ""}))}
        >
            <SupportGroupList list={supportGroups?.filter(g => g.status === "confirmed")} setSelected={setSelected} selected={selected}/>
            <SupportGroupDetail selected={selected}/>
        </PlatformPageLayout>
    )

}

export default SupportGroups