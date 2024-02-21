import { Flex, Stack, Icon, Avatar, Image, Text, useBoolean } from '@chakra-ui/react'
import { FC } from 'react'
import { IoIosInformationCircle } from 'react-icons/io'
import { ISupportGroup } from '../../../Interface'
import DescriptionModal from './DescriptionModal'

const ChatSupportGroupDetail: FC<{ supportGroup: ISupportGroup }> = ({ supportGroup }) => {
    const [showDescriptionModal, { toggle: toggleDescriptionModal }] = useBoolean()
    return (
        <>
            <Flex direction="row" gap="1rem" w="100%">
                <Image src={supportGroup.cover_img} h="125px" borderRadius="1rem" />
                <Stack w="100%" h="100%">
                    <Flex direction="row" w="100%" justify="space-between" align="center">
                        <Text fontSize="24px" fontWeight={600} textTransform="capitalize" align="left">
                            {supportGroup.support_group_name}
                        </Text>
                        <Icon as={IoIosInformationCircle} cursor="pointer" color="blue.500" width="30px" height="30px" onClick={toggleDescriptionModal} />
                    </Flex>
                    <Flex direction="row" justify="space-between" align="center" bg="gray.100" p="1rem" w="100%" h="100%" borderRadius="1rem">
                        <Flex direction="row" gap="1rem" align="center">
                            <Avatar src={supportGroup.support_group_manager_avatar} />
                            <Flex direction="column">
                                <Text align="left" fontWeight="600">
                                    {supportGroup.support_group_manager_name}
                                </Text>
                                <Text align="left" fontWeight="600">
                                    {supportGroup.support_group_manager_mail}
                                </Text>
                            </Flex>
                        </Flex>
                        <Text align="left" mb="0.7rem" fontWeight={600}>
                            {supportGroup.createdAt}
                        </Text>
                    </Flex>
                </Stack>
            </Flex>
            <DescriptionModal
            isOpen={showDescriptionModal}
            onClose={toggleDescriptionModal}
            name={supportGroup.support_group_name}
            description={supportGroup.description}
            />
        </>
    )
}

export default ChatSupportGroupDetail
