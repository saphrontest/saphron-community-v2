import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Image,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { Community } from "../Interface/CommunityInterface";
import { auth, firestore, storage } from "../firebaseClient";
import { Link, useNavigate } from "react-router-dom";
import { getCommunityDetail } from "../Helpers/apiFunctions";
import { Input } from "../chakra/input";
import { InputItem } from "../Layouts";

type AboutProps = {
  communityId: string;
  pt?: number;
  onCreatePage?: boolean;
  loading?: boolean;
};

const About: React.FC<AboutProps> = ({
  communityId,
  pt,
  onCreatePage,
  loading,
}) => {
  const [user] = useAuthState(auth); // will revisit how 'auth' state is passed
  const toast = useToast()
  const selectFileRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [addDescriptionView, setAddDescriptionView] = useState(false)
  const [descriptionText, setDescriptionText] = useState("")
  const [community, setCommunity] = useState<Community>()

  useEffect(() => {
    getCommunityDetail(communityId).then((result) => {
      setCommunity(result)
    }).catch((err) => {
      console.error("GET COMMUNITY DETAIL ERROR: ", err)
    });
  }, [communityId])

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const updateImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      const imageRef = ref(storage, `communities/${community?.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      community && await updateDoc(doc(firestore, "communities", community?.id), {
        imageURL: downloadURL,
      });
      console.log("HERE IS DOWNLOAD URL", downloadURL);
    } catch (error: any) {
      console.log("updateImage error", error.message);
    }
    // April 24 - removed reload
    // window.location.reload();

    setImageLoading(false);
  };

  const addDescription = async () => {
    try {
      const commDoc = doc(firestore, "communities", communityId);
      await updateDoc(commDoc, {
        description: descriptionText
      })
      setAddDescriptionView(false)
    } catch (error: any) {
      toast({
        title: "Try Again later..",
        status: "error",
        isClosable: true,
      })
      console.log("updateDescription error", error.message);
    }
  }

  return (
    <Box pt={pt} position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="blue.400"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
      </Flex>
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
              {community?.description ? (
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
              ) : (
                user?.uid === community?.creatorId  && !addDescriptionView ? (
                  <Box
                    bg="gray.100"
                    width="100%"
                    p={2}
                    borderRadius={4}
                    border="1px solid"
                    borderColor="gray.300"
                    cursor="pointer"
                    onClick={() => setAddDescriptionView(prev => !prev)}
                  >
                    <Text fontSize="9pt" fontWeight={700} color="blue.500">
                      Add description
                    </Text>
                  </Box>
                )
               : (
                <>
                      <InputItem
                        name="description"
                        placeholder="Description"
                        type="text"
                        onChange={({target: { value }}: React.ChangeEvent<HTMLInputElement>) => setDescriptionText(value)}
                      />
                      <Button onClick={addDescription}>
                        <Text>Add</Text>
                      </Button>
                </>
              )
              )}
            <Stack spacing={2} >
              <Flex direction="column" flexGrow={1}  paddingTop={2} paddingBottom={2}>
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
              {!onCreatePage && (
                <Link to={`/submit/${community?.id}`}>
                  <Button mt={3} height="30px">
                    Create Post
                  </Button>
                </Link>
              )}
              {/* !!!ADDED AT THE VERY END!!! INITIALLY DOES NOT EXIST */}
              {user?.uid === community?.creatorId && (
                <>
                  <Divider />
                  <Stack fontSize="10pt" spacing={1}>
                    <Text fontWeight={600}>Admin</Text>
                    <Flex align="left" justify="space-between" direction="column" gap={3}>
                      <Text
                        color="blue.500"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => selectFileRef.current?.click()}
                      >
                        Change Image
                      </Text>
                      <Image src={community?.imageURL || selectedFile} boxSize={community?.imageURL || selectedFile ? 40 : 30} alt="ICON" />
                    </Flex>
                    {selectedFile &&
                      (imageLoading ? (
                        <Spinner />
                      ) : (
                        <Button height="30px" maxWidth={120}>Save Changes</Button>
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
    </Box>
  );
};
export default About;
