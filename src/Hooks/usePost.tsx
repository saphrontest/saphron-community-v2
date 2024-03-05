import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { Community, IPost, IUser } from "../Interface";
import { firestore, storage } from "../firebaseClient";
import { Transaction, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, increment, orderBy, query, runTransaction, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { createSlug } from "../Helpers";
import md5 from "md5";
import moment from "moment";

const usePost = () => {
  const params = useParams()
  const navigate = useNavigate()

  /**
   * DELETE POST
   * The onDelete function deletes a post's image and document from Firestore, with optional success
   * and error callbacks.
   * @param {IPost} post - The `post` parameter is an object of type `IPost`, which likely contains
   * information about a post such as its id, title, content, imageURL, etc.
   * @param {Function} [onSuccess] - The `onSuccess` parameter in the `onDelete` function is a callback
   * function that will be executed if the deletion operation is successful. It is an optional
   * parameter, so you can pass a function to be executed after the deletion is successful.
   * @param {Function} [onError] - The `onError` parameter in the `onDelete` function is a callback
   * function that will be executed if an error occurs during the deletion process. It provides a way
   * to handle errors or perform specific actions when an error occurs while deleting a post.
   * @param {Function} [onEnd] - The `onEnd` parameter in the `onDelete` function is a function that
   * will be called after the deletion process is completed, regardless of whether it was successful or
   * not. This can be used to perform any cleanup tasks or actions that need to be done after the
   * deletion operation.
   * @returns The `onDelete` function returns a boolean value - `true` if the deletion process is
   * successful, and `false` if an error occurs during the process.
   */
  const onDelete = async (
    post: IPost,
    onSuccess?: Function,
    onError?: Function,
    onEnd?: Function
  ) => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);
      params.slug && window.history.back()
      onSuccess && onSuccess();
      return true;
    } catch (error) {
      onError && onError();
      return false;
    } finally {
      onEnd && onEnd();
    }
  }

  /**
   * CREATE A NEW POST
   * The `onCreate` function creates a new post in a Firestore database with optional image upload
   * functionality and then navigates to the newly created post's page.
   * @param {IUser} user - The `user` parameter in the `onCreate` function represents the user who is
   * creating the post. It is expected to be an object of type `IUser`, which likely contains
   * information about the user such as their id, username, and other relevant details.
   * @param {string} body - The `body` parameter in the `onCreate` function represents the main content
   * or text of the post that the user wants to create. It typically contains the detailed information,
   * message, or description that the user wants to share with the community.
   * @param {string} title - The `title` parameter in the `onCreate` function represents the title of
   * the post that is being created. It is a required parameter and is used to provide a title for the
   * post that will be displayed to users in the community.
   * @param {Community} community - Community is an object that represents a community in your
   * application. It likely contains properties such as id, imageURL, and possibly other information
   * related to the community. In the `onCreate` function, the `community` parameter is used to extract
   * the `id` and `imageURL` properties from the
   * @param {string} [imageFile] - The `imageFile` parameter in the `onCreate` function is an optional
   * parameter that represents the image file associated with the post being created. If an image file
   * is provided, it will be uploaded to a storage location and the download URL of the image will be
   * stored in the post document.
   */
  const onCreate = async (
    user: IUser,
    body: string,
    title: string,
    community: Community,
    imageFile?: string,
  ) => {
    
    const newPostId = md5(`${title}.${moment().toString()}`)
    const slugId = md5(newPostId).slice(0,4)
    const slug = createSlug(title)
    
    try {
      const newPostDocRef = doc(firestore, "posts", newPostId)
      await runTransaction(firestore, async (transaction: Transaction) => {
        transaction.set(newPostDocRef, {
          body,
          title: title,
          communityId: community.id,
          communityImageUrl: community.imageURL || "",
          creatorId: user?.id,
          userDisplayText: user.username,
          numberOfComments: 0,
          voteStatus: 0,
          createdAt: moment().toString(),
          editedAt: moment().toString(),
          slug,
          slugId 
        })
      })

      if (imageFile) {
        const imageRef = ref(storage, `posts/${newPostId}/image`);
        await uploadString(imageRef, imageFile, "data_url")
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(newPostDocRef, {
          imageURL: downloadURL
        })
      }

    } catch (error) {
      console.log("on create post", error)
    } finally {
      navigate(`/community/post/${slugId}/${createSlug(title)}`)
    }
  }

  /**
   * SAVE POST
   * The function `onSave` asynchronously saves or deletes a post document in Firestore based on its
   * existence for a specific user.
   * @param {IPost} post - The `post` parameter in the `onSave` function represents an object with the
   * following properties:
   * @param {string} userId - The `userId` parameter in the `onSave` function represents the unique
   * identifier of the user who is saving the post. This identifier is used to locate the specific user
   * in the Firestore database and manage their saved posts.
   */
  const onSave = async (post: IPost, userId: string) => {
    const savePostRef = doc(firestore, "users", userId, "savedPosts", post.id);
    await getDoc(savePostRef)
      .then(async (docSnapshot) => {
        if (docSnapshot.exists()) {
          // Document exists, you can access its data using docSnapshot.data()
          const data = docSnapshot.data();
          console.log("Document data:", data);
          await deleteDoc(savePostRef)
            .then(() => {
              console.log("Document deleted. Post removed.");
              return true;
            })
            .catch((error) => {
              console.error("Error deleting document:", error);
              return false;
            })
        } else {
          // Document does not exist
          await setDoc(savePostRef, {
            id: post.id,
            communityId: post.communityId,
            creatorId: post.creatorId,
            title: post.title,
            body: post.body,
            numberOfComments: post.numberOfComments,
            voteStatus: post.voteStatus,
            createdAt: post.createdAt,
            userDisplayText: post.userDisplayText,
            slug: post.slug
          })
            .then(() => {
              console.log("Post saved.");
              return true;
            })
            .catch((error) => {
              console.error("Error creating document:", error);
              return false;
            });
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        return false;
      });
  }

  /**
   * CREATE A NEW COMMENT
   * The function `createComment` asynchronously creates a new comment document in Firestore and
   * updates the number of comments for a specific post.
   * @param {IPost} post - The `post` parameter in the `createComment` function is of type `IPost`,
   * which likely represents a post object with properties such as `id` and `title`. It is used to
   * associate the comment with a specific post by storing the post's id and title in the comment
   * document.
   * @param {IUser} user - The `user` parameter in the `createComment` function represents the user who
   * is creating the comment. It should be an object that contains information about the user, such as
   * their `id`, `email`, and `profilePhotoURL`. The `id` is a unique identifier for the user,
   * @param {string} comment - The `comment` parameter in the `createComment` function is a string that
   * represents the text content of the comment that the user wants to create and associate with a
   * specific post. This comment will be stored in a Firestore document along with other details such
   * as the post ID, creator ID, creator display
   */
  const createComment = async (post: IPost, user: IUser, comment: string) => {
    const batch = writeBatch(firestore);

    // Create comment document
    const commentDocRef = doc(collection(firestore, "comments"));
    batch.set(commentDocRef, {
      postId: post.id,
      creatorId: user.id,
      creatorDisplayText: user.email!.split("@")[0],
      creatorPhotoURL: user.profilePhotoURL,
      text: comment,
      postTitle: post.title,
      createdAt: new Date(),
      voteValue: 0
    });

    // Update post numberOfComments
    batch.update(doc(firestore, "posts", post.id), {
      numberOfComments: increment(1),
    });
    await batch.commit();
  }

  /**
   * DELETE POST COMMENT
   * The function `deleteComment` deletes a comment, deletes associated comment votes, and updates the
   * number of comments for a post in a TypeScript React application.
   * @param {string} commentId - The `commentId` parameter is the unique identifier of the comment that
   * you want to delete. It is used to locate and delete the specific comment from the database.
   * @param {string} postId - The `postId` parameter in the `deleteComment` function represents the
   * unique identifier of the post to which the comment belongs. This identifier is used to locate the
   * specific post in the database and update its `numberOfComments` field when a comment is deleted.
   */
  const deleteComment = async (commentId: string, postId: string) => {
    // delete the comment
    const commentRef = doc(firestore, "comments", commentId)
    await deleteDoc(commentRef);

    // delete the comment votes for all users which is voted for the comment
    const commentVotesRef = collectionGroup(firestore, "commentVotes")
    const commentDocs = await getDocs(commentVotesRef)
    commentDocs.forEach(async doc => {
        if (doc.data().commentId === commentId) {
            await deleteDoc(doc.ref);
        }
    })

    // update the numberOfComments for the post
    const batch = writeBatch(firestore)
    const postRef = doc(firestore, "posts", postId)
    batch.update(postRef, {
        numberOfComments: increment(-1)
    })
    batch.commit()
  }

  const getPosts = async () => {
    const q = query(collection(firestore, "posts"), orderBy('createdAt', 'desc'));
    const postDocs = await getDocs(q);
    const posts = postDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as IPost;
    });
    return posts
  };

  const getPostsByUser = async (creatorId: string) => {
    const posts: IPost[] = []
    const postsDoc = await getDocs(query(collection(firestore, "posts"), where("creatorId", "==", creatorId)));
    postsDoc.docs.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as IPost);
    });
    return posts;
  }

  //TODO: WORK ON POST STATE && SAVED POSTS
  const getSavedPostsByUser = async (userId: string) => {
    // Construct a reference to the subcollection
    const savedUsersCollectionRef = collection(firestore, "users", userId, "savedPosts");
  
    // Create a query to retrieve all documents in the subcollection
    const q = query(savedUsersCollectionRef);
  
    // Try to get the documents in the subcollection
    getDocs(q)
      .then((querySnapshot: any) => {
        const savedPosts: any[] = []
        querySnapshot.forEach((docSnapshot: any) => {
          // Access each document's data using docSnapshot.data()
          const data = docSnapshot.data();
          const { createdAt: {nanoseconds, seconds}, ...postData} = data
          savedPosts.push({ ...postData, createdAt: { nanoseconds, seconds } });
        });
        return savedPosts
      })
      .catch((error) => {
        console.error("Error getting documents:", error);
      });
  };

  return {
    onSave,
    onDelete,
    onCreate,
    createComment,
    deleteComment,
    getPosts,
    getPostsByUser,
    getSavedPostsByUser
  }
}

export default usePost
