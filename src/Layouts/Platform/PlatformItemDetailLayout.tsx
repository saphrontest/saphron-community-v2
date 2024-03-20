import { Flex } from '@chakra-ui/react';
import { FC, ReactNode } from 'react'

interface IPlatformItemDetailLayoutProps {
    coverImg: string;
    children: ReactNode[];
    wrapperWidth?: string;
}

const PlatformItemDetailLayout:FC<IPlatformItemDetailLayoutProps> = ({
    coverImg,
    children,
    wrapperWidth
}) => {
    return (
        <Flex
            w={wrapperWidth ? wrapperWidth : "50%"}
            h="fit-content"
            align="flex-start"
            justify="flex-start"
            direction="column"
            bg="gray.100"
            borderRadius="16px"
        >
            <Flex
                w="100%"
                align="flex-end"
                color="white"
                bg="blue.500"
                height="150px"
                borderRadius="16px 16px 0px 0px"
                fontWeight={600}
                backgroundSize="cover"
                bgPos="center"
                bgImage={coverImg}
            >
                <Flex
                    width="100%"
                    height="100%"
                    align="flex-end"
                    color="white"
                    p="6px 10px"
                    borderRadius="16px 16px 0 0"
                    bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.75))"
                >

                    <Flex width="100%" justify="space-between" align="flex-end" h="100%" direction="row">
                        {children[0]}
                    </Flex>
                </Flex>
            </Flex>
            <Flex p="1rem" direction="column" w="100%">
                {children[1]}
            </Flex>
        </Flex>
    )
}

export default PlatformItemDetailLayout