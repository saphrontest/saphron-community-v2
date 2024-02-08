import { Flex, Stack, SkeletonCircle, Skeleton, Divider, Icon, Button, Spinner, Text, Box, Image } from '@chakra-ui/react'
import moment from 'moment'
import React, { FC } from 'react'
import { RiCakeLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { Community } from '../../Interface/CommunityInterface'
import { setSelectedCommunity } from '../../redux/slices/communitySlice'
import { UserInterface } from '../../Interface/UserInterface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import AddDescription from './AddDescription'

interface IContentProps {
  loading?: boolean;
  community: Community;
  onCreatePage?: boolean;
  selectedFile?: string;
  selectFileRef: React.RefObject<HTMLInputElement>;
  imageLoading: boolean;
  updateImage: () => void;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addDescriptionView: boolean;
  addDescription: () => void;
  setAddDescriptionView: (arg: boolean) => void;
  setDescriptionText: (arg: string) => void;
}

const Content: FC<IContentProps> = ({
  loading,
  community,
  onCreatePage,
  selectedFile,
  selectFileRef,
  updateImage,
  onSelectImage,
  imageLoading,
  addDescription,
  addDescriptionView,
  setDescriptionText,
  setAddDescriptionView
}) => {
  const dispatch = useDispatch()
  const user: UserInterface = useSelector((state: RootState) => state.user)
  return (
    <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
      {loading ? (
        <Stack mt={2}>
          <SkeletonCircle size="10" />
          <Skeleton height="10px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <>
          {community?.description && (
            <>
              <Text textAlign={"left"} fontWeight={700} fontSize={14} pb={3}>Description</Text>
              <Box
                bg="gray.100"
                width="100%"
                p={2}
                borderRadius={4}
                border="1px solid"
                borderColor="gray.300"
              >
                <Text fontSize="9pt" fontWeight={700} color="blue.500" textAlign={"left"}>
                  {community?.description}
                </Text>
              </Box>
            </>
          )}
          {
            user.id === community?.creatorId &&
            <AddDescription
              addDescriptionView={addDescriptionView}
              addDescription={addDescription}
              setAddDescriptionView={setAddDescriptionView}
              setDescriptionText={setDescriptionText}
            />
          }
          <Stack spacing={2} >
            <Flex direction="column" flexGrow={1} paddingTop={2} paddingBottom={2}>
              <Text textAlign={"left"} fontWeight={700} fontSize={14} pb={2}>Name</Text>
              <Text align="left" pl={2}>
                {community?.name}
              </Text>
            </Flex>
            <Divider />
            <Flex width="100%" p={2} fontWeight={600} fontSize="10pt" direction="column">
              <Flex direction="column" flexGrow={1}>
                <Text>
                  {community?.numberOfMembers?.toLocaleString()}
                </Text>
                <Text>Members</Text>
              </Flex>
            </Flex>
            <Divider />
            <Flex
              align="center"
              width="100%"
              p={1}
              fontWeight={500}
              fontSize="10pt"
            >
              <Icon as={RiCakeLine} mr={2} fontSize={18} />
              {community?.createdAt && (
                <Text>
                  Created{" "}
                  {moment(
                    new Date(community.createdAt!.seconds * 1000)
                  ).format("MMM DD, YYYY")}
                </Text>
              )}
            </Flex>
            {(!onCreatePage && user.id) && (
              <Link to={`/submit/${community?.id}`}>
                <Button
                  mt={3}
                  height="30px"
                  onClick={() => community && dispatch(setSelectedCommunity(community as Community))}
                >
                  Create Post
                </Button>
              </Link>
            )}
            {/* !!!ADDED AT THE VERY END!!! INITIALLY DOES NOT EXIST */}
            {user.id === community?.creatorId && (
              <>
                <Divider />
                <Stack display={"flex"} flexDirection={"row"} alignItems={"center"} fontSize="10pt" spacing={4}>
                  {(community?.imageURL || selectedFile) && <Image
                    src={community?.imageURL || selectedFile}
                    boxSize={community?.imageURL || selectedFile ? 10 : 30}
                    borderRadius={"full"}
                    alt="ICON" />}
                  <Flex align="start" justify="space-between" direction="column">
                    <Text fontWeight={600}>Admin</Text>
                    <Text
                      color="blue.500"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => selectFileRef.current?.click()}
                    >
                      {community?.imageURL ? "Change Image" : "Add Image"}
                    </Text>
                  </Flex>
                  {selectedFile &&
                    (imageLoading ? (
                      <Spinner />
                    ) : (
                      <Button height="30px" maxWidth={120} onClick={updateImage}>Save Changes</Button>
                    ))}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    hidden
                    ref={selectFileRef}
                    onChange={onSelectImage}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </>
      )}
    </Flex>
  )
}

export default Content