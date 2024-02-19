import { Flex, Button, Text } from "@chakra-ui/react";
import { AuthButtons } from "../../Nav/Partials";
import { UserInterface } from "../../../Interface";
import TextEditor from "../../TextEditor";

type CommentInputProps = {
  comment: string;
  loading: boolean;
  user?: UserInterface | null;
  setComment: (value: string) => void;
  onCreateComment: (comment: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  comment,
  setComment,
  loading,
  user,
  onCreateComment,
}) => {

  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1} textAlign="left">
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.username}
            </span>
          </Text>
          <TextEditor onChange={(_, data: string) => setComment(data)} value={comment}/>
          <Flex
            position="absolute"
            width={"calc(100% - 1px)"}
            left={"0.5px"}
            bottom="0px"
            zIndex={1}
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!comment.length}
              isLoading={loading}
              onClick={() => onCreateComment(comment)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
