import { PageLayout } from '../Layouts'
import { Button, Flex, Text } from '@chakra-ui/react'
import { SupportGroupDetail, SupportGroupList } from '../Components'
import communitiesBackground from '../assets/images/communities.jpg'
import { useDispatch } from 'react-redux'
import { setModal } from '../redux/slices/modalSlice'

const SupportGroups = () => {
    const dispatch = useDispatch()
    return (
        <PageLayout
            showSidebar={false}
            leftWidth="100%"
        >
            <>
                <Flex
                    p={1}
                    w="100%"
                    h="fit-content"
                    bg="white"
                    flexDirection="column"
                    display="flex"
                >
                    <Flex
                        align="flex-end"
                        color="white"
                        bg="blue.500"
                        height={["150px", "250px"]}
                        borderRadius="4px 4px 0px 0px"
                        fontWeight={600}
                        backgroundSize="cover"
                        bgPos="center"
                        bgImage={communitiesBackground}
                    >
                        <Flex
                            width="100%"
                            height="100%"
                            align="flex-end"
                            color="white"
                            p="6px 10px"
                            bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
                        >
                            <Flex width="100%" height={"50%"} justify="space-between" align={["flex-start", "flex-end"]} direction={["column", "row"]} paddingX="0.5rem">
                                <Text fontSize={24} fontWeight={700}>
                                    Support Groups
                                </Text>
                                <Button onClick={() => dispatch(setModal({isOpen: true, view: 'createSupportGroup', data: ""}))}>
                                    Create group chat
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex w="100%" p="1rem">
                        <SupportGroupList />
                        <SupportGroupDetail />
                    </Flex>
                </Flex>
            </>
            <></>
        </PageLayout>
    )
}

export default SupportGroups