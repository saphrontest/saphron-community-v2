import React, { useState } from 'react'
import { ModalLayout } from '../../Layouts'
import { Box, Button, Divider, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/slices/modalSlice';
import { RootState } from '../../redux/store';
import { setCommunities, setJoinedCommunities } from '../../redux/slices/communitySlice';
import { useCommunity, useReward } from '../../Hooks';

const AddCommunityModal = () => {

    const dispatch = useDispatch()
    const {winRewardBySlug} = useReward()
    const { getCommunities, getJoinedCommunities, onCreate: createCommunity } = useCommunity()

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState("");
    const [charsRemaining, setCharsRemaining] = useState(21);
    
    const user = useSelector((state: RootState) => state.user)

    const handleClose = () => dispatch(setModal({ isOpen: false, view: null }))

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return;
        setName(event.target.value.replace(/ /g, "_"));
        setCharsRemaining(21 - event.target.value.length);
    };

    const validateName = (name: string) => {
        // eslint-disable-next-line no-useless-escape
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (format.test(name) || name.length < 3) {
            return setNameError(
                "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
            );
        }
    }

    const handleCreateCommunity = async () => {

        if (nameError) setNameError("");
        
        validateName(name)

        setLoading(true);

        try {
            
            await createCommunity(name, user.id)

            await winRewardBySlug("create_community", user.id)

            getJoinedCommunities(user.id)
                .then(res => res && dispatch(setJoinedCommunities(res)))
            
            getCommunities()
                .then(res => res && dispatch(setCommunities(res)))

            handleClose();

        } catch (error: any) {

            console.log("Transaction error", error);
            setNameError(error.message);

        } finally {
            
            getCommunities()
                .then(res => res && dispatch(setCommunities(res)))

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