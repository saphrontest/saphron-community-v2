import comm from '../../assets/images/menthal.jpg'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { setModal } from '../../redux/slices/modalSlice'
import { useDispatch } from 'react-redux'

const SupportGroupDetail = () => {
    const dispatch = useDispatch()
    return (
        <Flex
        w="50%"
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
            bgImage={comm}
            >
                <Flex
                p="6px 10px"
                width="100%"
                height="100%"
                align="flex-end"
                color="white"
                borderRadius="16px 16px 0px 0px"
                bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.75))"
                >
                    <Flex
                    h="100%"
                    width="100%"
                    direction="row"
                    align="flex-end" 
                    justify="space-between"
                    >
                        <Box>
                            <Text fontSize={22} fontWeight={700} marginBottom="0.3rem" align="left">
                                name
                            </Text>
                            <Box
                            bg="white"
                            w="fit-content"
                            h="fit-content"
                            p="0.2rem 0.6rem"
                            borderRadius="99px"
                            >
                                <Text fontWeight="600" color="black">
                                    category
                                </Text>
                            </Box>
                        </Box>
                        <Flex direction="column" align="flex-end" justify="flex-end" h="100%">
                            <Flex align="center" gap={"0.7rem"}>
                                <Image src={comm} w="30px" borderRadius="30px" />
                                <Text align="left" noOfLines={1}>
                                    manager name
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex p="1rem" direction="column" w="100%">
                <Text fontWeight={700} align="left" mb="0.7rem">
                    date
                </Text>
                <Text fontStyle="italic" align="left" mb="0.7rem">
                    desc
                </Text>
                <Text
                align="left"
                fontWeight="600"
                dangerouslySetInnerHTML={{ __html: "<p>description 2</p>" }}
                />
                <Flex w="100%" justify="flex-end">
                    <Button
                    w="fit-content"
                    h="fit-content"
                    p="0.4rem 1.5rem"
                    onClick={() => dispatch(setModal({isOpen: true, view: 'joinSupportGroup', data: ""}))}
                    >
                        I wan't to join!
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default SupportGroupDetail