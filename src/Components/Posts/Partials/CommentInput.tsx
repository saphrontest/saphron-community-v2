import { Flex, Button, Text } from "@chakra-ui/react";
import { IUser } from "../../../Interface";
import TextEditor from "../../TextEditor";
import { useDispatch } from "react-redux";
import { setModal } from "../../../redux/slices/modalSlice";

type CommentInputProps = {
  comment: string;
  loading: boolean;
  user?: IUser | null;
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

  const dispatch = useDispatch()

  return (
    <Flex direction="column" align="center">
      {user?.id ? (
        <Flex w="100%" direction="column" px="1rem" pb="1rem">
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
        </Flex>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          py="1rem"
          direction="column"
          onClick={() => dispatch(setModal({isOpen: true, view: 'login'}))}
        >
          <Text textDecoration="underline" fontWeight={600}>Log in or sign up to leave a comment</Text>
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
