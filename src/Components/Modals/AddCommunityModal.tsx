import React, { useState } from 'react'
import { ModalLayout } from '../../Layouts'
import { Box, Button, Divider, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, useToast} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import { firestore } from '../../firebaseClient';
import { doc, runTransaction } from 'firebase/firestore';
import md5 from 'md5';
import { RootState } from '../../redux/store';
import { getCommunities, getJoinedCommunitiesList } from '../../Helpers/apiFunctions';
import { setCommunities, setJoinedCommunities } from '../../redux/slices/communitySlice';
import moment from 'moment';
import { useReward } from '../../Hooks';

const AddCommunityModal = () => {

    const dispatch = useDispatch()
    const toast = useToast()
    const {winRewardBySlug} = useReward()
    const user = useSelector((state: RootState) => state.user)
    const [name, setName] = useState("");
    const [charsRemaining, setCharsRemaining] = useState(21);
    const [nameError, setNameError] = useState("");
    // const [communityType, setCommunityType] = useState("public");
    const [loading, setLoading] = useState(false);

    const handleClose = () => dispatch(setModal({ isOpen: false, view: null }))

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return;
        setName(event.target.value.replace(/ /g, "_"));
        setCharsRemaining(21 - event.target.value.length);
    };

    const handleCreateCommunity = async () => {
        if (nameError) setNameError("");
        
        // eslint-disable-next-line no-useless-escape
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (format.test(name) || name.length < 3) {
            return setNameError(
                "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
            );
        }

        setLoading(true);

        try {
            const newCommunityId = md5(`${name}.${new Date().getTime().toString()}`)
            // Create community document and community as a subcollection document on user
            const communityDocRef = doc(firestore, "communities", newCommunityId);

            await runTransaction(firestore, async (transaction) => {
                const communityDoc = await transaction.get(communityDocRef);
                if (communityDoc.exists()) {
                    toast({
                        title: `Sorry, comm/${name} is taken. Try another.`,
                        status: "error",
                        isClosable: true,
                        position: "top-right"
                    })
                    throw new Error(`Sorry, comm/${name} is taken. Try another.`);
                }
                
                transaction.set(communityDocRef, {
                    name: name,
                    creatorId: user?.id,
                    createdAt: moment().toString(),
                    numberOfMembers: 1,
                    privacyType: "public",
                });

                transaction.set(
                    doc(firestore, `users/${user?.id}/communities`, newCommunityId), {
                        communityId: newCommunityId,
                        isModerator: true,
                    }
                );
            });
            await winRewardBySlug("create_community", user.id)
            const joined = await getJoinedCommunitiesList(user.id)
            joined && dispatch(setJoinedCommunities(joined))
            const communities = await getCommunities()
            dispatch(setCommunities(communities))
            handleClose();

        } catch (error: any) {
            console.log("Transaction error", error);
            setNameError(error.message);
        } finally {
            getCommunities()
            setLoading(false);
        }
        
    };

    return (
        <ModalLayout>
            <ModalHeader
                display="flex"
                flexDirection="column"
                fontSize={15}
                padding={3}
            >
                Create a community
            </ModalHeader>
            <Box pr={3} pl={3}>
                <Divider />
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" padding="10px 0px">
                    <Text fontWeight={600} fontSize={15}>
                        Name
                    </Text>
                    <Text fontSize={11} color="gray.500">
                        Community names including capitalization cannot be changed
                    </Text>
                    <Text
                        color="gray.400"
                        position="relative"
                        top="28px"
                        left="10px"
                        width="60px"
                    >
                        comm/
                    </Text>
                    <Input
                        position="relative"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        pl="65px"
                        type={""}
                        size="sm"
                    />
                    <Text
                        fontSize="9pt"
                        color={charsRemaining === 0 ? "red" : "gray.500"}
                        pt={2}
                    >
                        {charsRemaining} Characters remaining
                    </Text>
                    <Text fontSize="9pt" color="red" pt={1}>
                        {nameError}
                    </Text>
                    {/* <Box mt={4} mb={4}>
                        <Text fontWeight={600} fontSize={15}>
                            Community Type
                        </Text>
                        <Stack spacing={2} pt={1}>
                            <Checkbox
                                colorScheme="blue"
                                name="public"
                                isChecked={communityType === "public"}
                                onChange={onCommunityTypeChange}
                            >
                                <Flex alignItems="center">
                                    <Icon as={BsFillPersonFill} mr={2} color="gray.500" />
                                    <Text fontSize="10pt" mr={1}>
                                        Public
                                    </Text>
                                    <Text fontSize="8pt" color="gray.500" pt={1}>
                                        Anyone can view, post, and comment to this community
                                    </Text>
                                </Flex>
                            </Checkbox>
                            <Checkbox
                                colorScheme="blue"
                                name="restricted"
                                isChecked={communityType === "restricted"}
                                onChange={onCommunityTypeChange}
                            >
                                <Flex alignItems="center">
                                    <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                                    <Text fontSize="10pt" mr={1}>
                                        Restricted
                                    </Text>
                                    <Text fontSize="8pt" color="gray.500" pt={1}>
                                        Anyone can view this community, but only approved users can
                                        post
                                    </Text>
                                </Flex>
                            </Checkbox>
                            <Checkbox
                                colorScheme="blue"
                                name="private"
                                isChecked={communityType === "private"}
                                onChange={onCommunityTypeChange}
                            >
                                <Flex alignItems="center">
                                    <Icon as={HiLockClosed} color="gray.500" mr={2} />
                                    <Text fontSize="10pt" mr={1}>
                                        Private
                                    </Text>
                                    <Text fontSize="8pt" color="gray.500" pt={1}>
                                        Only approved users can view and submit to this community
                                    </Text>
                                </Flex>
                            </Checkbox>
                        </Stack>
                    </Box> */}
                </ModalBody>
            </Box>
            <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                <Button variant="outline" height="30px" mr={2} onClick={() => handleClose()}>
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    height="30px"
                    onClick={handleCreateCommunity}
                    isLoading={loading}
                >
                    Create Community
                </Button>
            </ModalFooter>
        </ModalLayout>
    )
}

export default AddCommunityModal