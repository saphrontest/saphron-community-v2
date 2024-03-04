import React, { FC, useRef, useState } from 'react'
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { Community, IUser } from '../../../Interface';
import { useToast } from '@chakra-ui/react';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { usePost } from '../../../Hooks';

interface CreatePostFormInterface {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
    community: Community
}

const CreatePostForm: FC<CreatePostFormInterface> = ({selectedTab, setSelectedTab, community}) => {
  const user: IUser = useSelector((state: RootState) => state.user)
  const {onCreate: createPost} = usePost()
  const toast = useToast()
  const [textInputs, setTextInputs] = useState<{ title: string; body: string; }>({
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

    if (!!user.id === false) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true
      })
      return;
    }

    if (!community) {
      toast({
        title: "Please select a community, first!",
        status: "error",
        isClosable: true
      })
      return;
    }

    setLoading(true);
    const { title, body } = textInputs

    try {
      await createPost(user, body, title, community, selectedFile)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
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
  ) : (
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