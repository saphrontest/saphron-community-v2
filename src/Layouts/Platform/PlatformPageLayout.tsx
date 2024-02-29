import React, { FC, ReactNode } from 'react'
import PageLayout from '../PageLayout'
import { Button, Flex, Text } from '@chakra-ui/react'

interface IPlatformPageLayoutProps {
  coverImg: string;
  title: string;
  actionButtonText: string;
  actionButtonOnClick: () => void;
  children: ReactNode;
}

const PlatformPageLayout:FC<IPlatformPageLayoutProps> = ({
  coverImg,
  title,
  actionButtonOnClick,
  actionButtonText,
  children
}) => {
  return (
    <PageLayout showSidebar={false} leftWidth="100%">
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
            bgPos={"center"}
            bgImage={coverImg}
          >
            <Flex
              width="100%"
              height="100%"
              align="flex-end"
              color="white"
              p="6px 10px"
              bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))"
            >
              <Flex width="100%" height={"50%"} justify="space-between" align={["flex-start", "flex-end"]} direction={["column", "row"]}>
                <Text fontSize={24} fontWeight={700}>
                  {title}
                </Text>
                <Button onClick={actionButtonOnClick}>
                    {actionButtonText}
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex direction="row" padding="1rem">
            {children}
          </Flex>
        </Flex>
      </>
      <>
      </>
    </PageLayout>
  )
}

export default PlatformPageLayout