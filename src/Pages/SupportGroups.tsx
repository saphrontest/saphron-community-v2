import { PlatformPageLayout } from '../Layouts'
import { Meta, SupportGroupDetail, SupportGroupList } from '../Components'
import communitiesBackground from '../assets/images/communities.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'
import { useEffect, useState } from 'react'
import { useSupportGroup } from '../Hooks'
import { ISupportGroup, IUser } from '../Interface'
import { RootState } from '../redux/store'
import { useToast } from '@chakra-ui/react'

const SupportGroups = () => {
    
    const toast = useToast()
    const dispatch = useDispatch()
    const { getSupportGroups } = useSupportGroup()

    const [selected, setSelected] = useState<ISupportGroup>()
    const [supportGroups, setSupportGroups] = useState<ISupportGroup[]>()

    const user: IUser = useSelector((state: RootState) => state.user)

    useEffect(() => {
        getSupportGroups()
            .then((result: ISupportGroup[]) => {
                result.length && setSupportGroups(result)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        (!!supportGroups?.length && !selected) && setSelected(supportGroups[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supportGroups])

    return (
        <PlatformPageLayout
            title="Support Groups"
            coverImg={communitiesBackground}
            actionButtonText="Create group chat"
            actionButtonOnClick={() => {
                if(!user.id) {
                    toast({
                        title: "Please login, first!",
                        status: "error",
                        isClosable: true,
                    })
                    return;
                }
                dispatch(setModal({
                    isOpen: true,
                    view: 'createSupportGroup',
                    data: ""
                }))
            }}
        >
            <Meta
                title={'Saphron Health | Support Groups'}
                description='Support Groups'
            />
            <SupportGroupList list={supportGroups} setSelected={setSelected} selected={selected} />
            <SupportGroupDetail selected={selected} />
        </PlatformPageLayout>
    )

}

export default SupportGroups