import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { Community } from "../Interface";
import { firestore, storage } from "../firebaseClient";
import { getCommunityDetail } from "../Helpers/apiFunctions";
import Content from "./About/Content";

type AboutProps = {
  community?: Community
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
  community: propCommunity
}) => {
  const toast = useToast()
  const selectFileRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [descriptionText, setDescriptionText] = useState<string>("")
  const [addDescriptionView, setAddDescriptionView] = useState<boolean>(false)
  const [community, setCommunity] = useState<Community>()

  useEffect(() => {

    if (propCommunity) {
      setCommunity(propCommunity)
      return;
    }

    getCommunityDetail(communityId).then((result) => {
      setCommunity(result)
    }).catch((err) => {
      console.error("GET COMMUNITY DETAIL ERROR: ", err)
    });

  }, [communityId, propCommunity])


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
    } catch (error: any) {
      console.log("updateImage error", error.message);
    }
    // April 24 - removed reload
    // window.location.reload();
    getCommunityDetail(communityId).then((result) => {
      setCommunity(result)
    }).catch((err) => {
      console.error("GET COMMUNITY DETAIL ERROR: ", err)
    });
    setSelectedFile(undefined)
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
        {!!community === false && <Spinner size="md" />}
      </Flex>
      {
        !!community && <Content
          loading={loading}
          community={community}
          onCreatePage={onCreatePage}
          selectedFile={selectedFile}
          selectFileRef={selectFileRef}
          imageLoading={imageLoading}
          updateImage={updateImage}
          onSelectImage={onSelectImage}
          addDescriptionView={addDescriptionView}
          addDescription={addDescription}
          setAddDescriptionView={setAddDescriptionView}
          setDescriptionText={setDescriptionText}
        />
      }
    </Box>
  );
};
export default About;
