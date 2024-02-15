import React, { FC, ReactNode } from 'react'
import PageLayout from '../PageLayout'
import { Flex, Heading } from '@chakra-ui/react'

const PlatformAdminPageLayout: FC<{
    children: ReactNode;
    title: string;
}> = ({children, title}) => {
    return (
        <PageLayout showSidebar={false} leftWidth='100%'>
            <>
                <Flex w="100%" bg="white" p="1rem" direction="column" align="flex-start">
                    <Heading fontSize="32px" fontWeight="800" pb="1rem">{title}</Heading>
                    <Flex w="100%" direction="column" gap="1rem">
                        {children}
                    </Flex>
                </Flex>
            </>
            <></>
        </PageLayout>
    )
}

export default PlatformAdminPageLayout