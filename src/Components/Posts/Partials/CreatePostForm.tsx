import React, { FC, useRef, useState } from 'react'
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';

interface CreatePostFormInterface {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

const CreatePostForm: FC<CreatePostFormInterface> = ({selectedTab, setSelectedTab}) => {
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
      });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string>();
    const selectFileRef = useRef<HTMLInputElement>(null);



    const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e)
    }

    const handleCreatePost = () => {

    }

    const onSelectImage = () => {
        
    }

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