import React, { FC, ReactNode } from 'react'
import PageLayout from '../PageLayout'
import { Button, Flex, ResponsiveValue, Text } from '@chakra-ui/react'

interface IPlatformPageLayoutProps {
  coverImg: string;
  title: string;
  actionButtonText?: string;
  actionButtonOnClick?: () => void;
  children: ReactNode;
  isFlexDirectionRow?: boolean;
}

const PlatformPageLayout:FC<IPlatformPageLayoutProps> = ({
  coverImg,
  title,
  actionButtonOnClick,
  actionButtonText,
  children,
  isFlexDirectionRow=true
}) => {
  return (
    <PageLayout showSidebar={false} leftWidth="100%">
      <>
        <Flex
          p={1}
          w="100%"
          h="fit-content"
          bg="white"
          display="flex"
          borderRadius="1rem"
          flexDirection="column"
        >
          <Flex
            align="flex-end"
            color="white"
            bg="blue.500"
            height={["150px", "250px"]}
            borderRadius="1rem 1rem 0px 0px"
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
                {actionButtonText && <Button onClick={actionButtonOnClick}>
                    {actionButtonText}
                </Button>}
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDirection={isFlexDirectionRow ? "row" : "column"} padding="1rem">
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