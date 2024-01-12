import React, { FC, useRef, useState } from 'react'
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../../firebaseClient';
import { Community } from '../../../Interface/CommunityInterface';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

interface CreatePostFormInterface {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
    community: Community
}

const CreatePostForm: FC<CreatePostFormInterface> = ({selectedTab, setSelectedTab, community}) => {
  const user = useSelector((state: RootState) => state.user)
  const toast = useToast()
  const navigate = useNavigate()
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
      });
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<string>();
    const selectFileRef = useRef<HTMLInputElement>(null);

    const onTextChange = (name: string, data: string) => {
      setTextInputs((prev) => ({ ...prev, [name]: data }));
    }

    const handleCreatePost = async () => {

        if(!!user.id === false){
          toast({
            title: "Please login, first!",
            status: "error",
            isClosable: true,
            position: "top-right"
          })
          return;
        }

        if(!community){
          toast({
            title: "Please select a community, first!",
            status: "error",
            isClosable: true,
            position: "top-right"
          })
          return;
        }

      setLoading(true);
      const {title, body} = textInputs
      
      function createSlug(str: string) {
        return str
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')    // Remove non-word characters (excluding spaces and hyphens)
          .replace(/[\s]+/g, '-')      // Replace spaces with hyphens
          .replace(/^-+|-+$/g, '');    // Remove leading and trailing hyphens
      }

      try {
        const postDocRef = await addDoc(collection(firestore, "posts"), {
          body,
          title: title,
          communityId: community.id,
          communityImageUrl: community.imageURL || "",
          creatorId: user?.id,
          userDisplayText: user?.email!.split("@")[0],
          numberOfComments: 0,
          voteStatus: 0,
          createdAt: serverTimestamp(),
          editedAt: serverTimestamp(),
          slug: createSlug(title)
        })

        if (selectedFile) {
          const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
          await uploadString(imageRef, selectedFile, "data_url")
          const downloadURL = await getDownloadURL(imageRef)
          await updateDoc(postDocRef, {
            imageURL: downloadURL
          })
        }
      } catch (error) {
        console.log("on create post", error)
      } finally {
        setLoading(false)
        navigate(`/post/${createSlug(title)}`)
      }

    }

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

  return selectedTab === "Post" ? (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        ) :(
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectImage}
          />
        )
}

export default CreatePostForm