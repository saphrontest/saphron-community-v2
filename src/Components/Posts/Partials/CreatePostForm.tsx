import React, { FC, useRef, useState } from 'react'
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, firestore, storage } from '../../../firebaseClient';
import { Community } from '../../../Interface/CommunityInterface';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

interface CreatePostFormInterface {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
    community: Community
}

const CreatePostForm: FC<CreatePostFormInterface> = ({selectedTab, setSelectedTab, community}) => {
  const [user] = useAuthState(auth)
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
      });
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<string>();
    const selectFileRef = useRef<HTMLInputElement>(null);

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {name, value} = e.target;
      setTextInputs((prev) => ({ ...prev, [name]: value }));
    }

    const handleCreatePost = async () => {

      setLoading(true);
      const {title, body} = textInputs

      try {
        const postDocRef = await addDoc(collection(firestore, "posts"), {
          body,
          title,
          communityId: community.id,
          communityImageUrl: community.imageURL || "",
          creatorId: user?.uid,
          userDisplayText: user?.email!.split("@")[0],
          numberOfComments: 0,
          voteStatus: 0,
          createdAt: serverTimestamp(),
          editedAt: serverTimestamp()
        })

        if (selectedFile) {
          const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
          await uploadString(imageRef, selectedFile, "data_url")
          const downloadURL = await getDownloadURL(imageRef)
          await updateDoc(postDocRef, {
            imageURL: downloadURL
          })
          console.log("downloded image:", downloadURL)
        }
      } catch (error) {
        console.log("on create post", error)
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