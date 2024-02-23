import { Button, Flex } from "@chakra-ui/react";
import { FC } from "react";

const ChatJoinButton: FC<{
    isAdmin: boolean;
    isUserParticipant: boolean;
    isUserConfirmedParticipant: boolean;
    handleJoinButton: () => void
}> = ({
    isAdmin, isUserConfirmedParticipant, isUserParticipant, handleJoinButton
}) => {

    if (isAdmin) {
        return null
    }
    if (isUserParticipant) {
        if (isUserConfirmedParticipant) {
            return <Flex align="center" bg="gray" color="white" height="30px" padding="0 1rem" borderRadius="1rem" fontWeight="600">Applied</Flex>
        }
        return null
    }
    return <Button height="30px" onClick={handleJoinButton}>Join</Button>
}

export default ChatJoinButton