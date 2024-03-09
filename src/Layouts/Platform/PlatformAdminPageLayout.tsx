import React, { FC, ReactNode } from 'react'
import PageLayout from '../PageLayout'
import { Flex, Heading } from '@chakra-ui/react'
import { AdminDrawer } from '../../Components';

const PlatformAdminPageLayout: FC<{
    children: ReactNode;
    title: string;
}> = ({children, title}) => {
    return (
        <PageLayout showSidebar={false} leftWidth='100%'>
            <Flex w="100%" bg="white" p="1rem" direction="column" align="flex-start">
                <Flex w="100%" align="center" gap="1rem" pb={"1rem"}>
                    <AdminDrawer />
                    <Heading fontSize="32px" fontWeight="800">{title}</Heading>
                </Flex>
                <Flex w="100%" direction="column" gap="1rem">
                    {children}
                </Flex>
            </Flex>
            <></>
        </PageLayout>
    )
}

export default PlatformAdminPageLayout