import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '../../redux/slices/modalSlice'
import { PlatformItemDetailLayout } from '../../Layouts'
import { Button, Flex, Image, Text, useMediaQuery, useToast } from '@chakra-ui/react'
import { ISupportGroup } from '../../Interface'
import { Link } from 'react-router-dom'
import { createSlug } from '../../Helpers'
import { RootState } from '../../redux/store'

const SupportGroupDetail: FC<{ selected?: ISupportGroup }> = ({ selected }) => {

    const toast  = useToast()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
    
    return selected && !isSmallerThan766 ? (
        <PlatformItemDetailLayout coverImg={selected.cover_img}>
            <>
                <Text fontSize={22} fontWeight={700} marginBottom="0.3rem" align="left">
                    {selected?.support_group_name}
                </Text>
                <Flex direction="column" align="flex-end" justify="flex-end" h="100%">
                    <Flex align="center" gap={"0.7rem"}>
                        <Image src={selected?.support_group_manager_avatar} w="30px" borderRadius="30px" />
                        <Text align="left" noOfLines={1}>
                            {selected?.support_group_manager_name}
                        </Text>
                    </Flex>
                </Flex>
            </>
            <>
                <Text fontWeight={700} align="left" mb="0.7rem">
                    {selected.createdAt}
                </Text>
                <Text
                align="left"
                fontWeight="600"
                dangerouslySetInnerHTML={{ __html: selected.description }}
                />
                <Link to={`${createSlug(selected.support_group_name)}`}>
                    <Text fontWeight="600" align="left" mt="1rem">
                        Show More...
                    </Text>
                </Link>
                {selected.support_group_manager_id !== user.id &&<Flex justify="flex-end">
                    <Button
                    w="fit-content"
                    h="fit-content"
                    p="0.4rem 1.5rem"
                    marginTop="0.7rem"
                    onClick={() => {
                        if (!user.id) {
                            toast({
                                title: "Please login, first!",
                                status: "error",
                                isClosable: true,
                                position: "top-right"
                            })
                            return;
                        }
                        dispatch(setModal({ isOpen: true, view: 'joinSupportGroup', data: selected }))
                    }}
                    >
                        I wan't to join!
                    </Button>
                </Flex>}
            </>
        </PlatformItemDetailLayout>
    ) : null

}

export default SupportGroupDetail