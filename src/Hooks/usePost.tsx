import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { Community, IPost, IUser } from "../Interface";
import { firestore, storage } from "../firebaseClient";
import { Transaction, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, runTransaction, setDoc, updateDoc, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { createSlug, getBlockedUsersByUserId } from "../Helpers";
import md5 from "md5";
import moment from "moment";
import { store } from "../redux/store";

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
    const slugId = md5(newPostId).slice(0, 4)
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
      navigate(`/community/post/${slugId}/${createSlug(title)}`, { state: { isSaved: false } })
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
   * The function `getPostsByUser` retrieves posts from Firestore based on the creator's ID.
   * @param {string} creatorId - The `creatorId` parameter in the `getPostsByUser` function is a string
   * that represents the unique identifier of the user whose posts you want to retrieve. This function
   * fetches posts from a Firestore collection based on the `creatorId` provided.
   * @returns An array of posts created by the user with the specified `creatorId`. Each post object in
   * the array includes an `id` field representing the document ID in Firestore and all the data fields
   * stored in the document. The array is casted as an array of `IPost` objects.
   */
  const getPostsByUser = async (creatorId: string) => {
    const postsDoc = await getDocs(query(collection(firestore, "posts"), where("creatorId", "==", creatorId)));
    const posts = postsDoc.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as IPost;
    });
    return posts as IPost[];
  }

  /**
   * The functions `getSavedPostsByUser` and `checkBlocked` are used to retrieve saved posts by a user
   * and check if a post creator is blocked by the current user, respectively.
   * @param {string} userId - The `userId` parameter in the `getSavedPostsByUser` function is used to
   * specify the user for whom you want to retrieve saved posts. This function retrieves all the saved
   * posts for a particular user based on their `userId`.
   * @returns The `getSavedPostsByUser` function returns an array of saved posts by a specific user,
   * while the `checkBlocked` function returns a boolean value indicating whether the post creator is
   * blocked by the current user.
   */
  const getSavedPostsByUser = async (userId: string) => {
    try {
      // Construct a reference to the subcollection
      const savedUsersCollectionRef = collection(firestore, `users/${userId}/savedPosts`);

      // Get the documents in the subcollection using async/await
      const querySnapshot = await getDocs(savedUsersCollectionRef);

      // Map the documents' data to an array of saved posts
      const savedPosts = querySnapshot.docs.map(doc => doc.data());

      return savedPosts as IPost[];
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error; // Rethrow the error to handle it at a higher level if needed
    }
  };

/**
 * The function `checkBlocked` checks if a post creator is blocked by the current user.
 * @param {string} postCreatorId - The `postCreatorId` parameter in the `checkBlocked` function is a
 * string representing the ID of the user who created a post. This function checks if the user who
 * created the post is blocked by the currently logged-in user.
 * @returns The function `checkBlocked` is returning a boolean value. It returns `false` if the current
 * user is not logged in (`store.getState().user.id` is falsy), indicating that the post creator is not
 * blocked. If the user is logged in, it fetches the list of blocked users for the current user and
 * checks if the `postCreatorId` matches any of the blocked users.
 */
  const checkBlocked = async (postCreatorId: string) => {

    if(!store.getState().user.id) {
      return false
    }
    
    const blocked = await getBlockedUsersByUserId(store.getState().user.id);
    return blocked.some(blockedUser => blockedUser.userId === postCreatorId);

  }

  /**
   * The function `getPosts` retrieves posts from a Firestore collection, filters them based on blocked
   * users if needed, and returns the posts as an array.
   * @param [getAll=false] - The `getAll` parameter in the `getPosts` function is a boolean parameter
   * with a default value of `false`. This parameter is used to determine whether all posts should be
   * retrieved or only non-blocked posts should be retrieved. If `getAll` is set to `true`, all posts
   * will be
   * @returns The `getPosts` function is returning an array of post objects. Each post object includes
   * the post ID, post data, and an additional property `isBlocked` if the post creator is blocked. If
   * `getAll` is true, all posts are returned without checking for blocked users.
   */
  const getPosts = async (getAll = false) => {

    const q = query(collection(firestore, "posts"), orderBy('createdAt', 'desc'));
    const postDocs = await getDocs(q);

    // Define a function to get blocked users and filter posts
    const getPosts = async (doc: any) => {
      if (!getAll) {

        const isBlocked = await checkBlocked(doc.data().creatorId)

        if (isBlocked) {
          return { id: doc.id, isBlocked: true, ...doc.data() } as IPost | { isBlocked: boolean; };
        }
        return { id: doc.id, ...doc.data() } as IPost

      }

      return { id: doc.id, ...doc.data() } as IPost

    };

    // Use Promise.all to await all asynchronous operations
    const posts = await Promise.all(postDocs.docs.map(getPosts));

    return posts as IPost[]

  };

  /**
   * The function `searchPost` searches for posts in a Firestore collection based on a keyword in the
   * post body or title.
   * @param {string} keyword - The `searchPost` function you provided is an asynchronous function that
   * searches for posts in a Firestore collection based on a keyword. It performs two separate queries,
   * one for the 'body' field and one for the 'title' field, using the keyword for filtering.
   * @returns The `searchPost` function returns an array of `IPost` objects that match the keyword in
   * either the `body` or `title` fields of the posts collection in Firestore.
   */
  const searchPost = async (keyword: string) => {

    if (!!keyword === false) return;

    const bodyQuery = query(
      collection(firestore, 'posts'),
      where('body', '>=', keyword),
      where('body', '<=', keyword + '\uf8ff')
    );

    const titleQuery = query(
      collection(firestore, 'posts'),
      where('title', '>=', keyword),
      where('title', '<=', keyword + '\uf8ff')
    );

    const [bodySnap, titleSnap] = await Promise.all([
      getDocs(bodyQuery),
      getDocs(titleQuery)
    ]);

    const bodyResults = bodySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as IPost);

    const titleResults = titleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as IPost);

    const results = [...bodyResults, ...titleResults];
    return results
  }

  /**
   * The function `getPostDetail` retrieves details of a post based on a provided slugId from a
   * Firestore collection in a TypeScript React application.
   * @param {string} slugId - The `slugId` parameter in the `getPostDetail` function is a string that
   * represents the unique identifier (slug) of a post. This function retrieves the details of a post
   * from a Firestore database based on the provided `slugId`.
   * @returns The `getPostDetail` function is returning an object that contains the `id` of the post
   * document and all the data of the post document retrieved from Firestore. The data is being
   * returned as an object of type `IPost`. If no matching post is found based on the `slugId`, the
   * function returns `null`.
   */
  const getPostDetail = async (slugId: string) => {
    try {
      const q = query(collection(firestore, "posts"), where("slugId", "==", slugId), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        // Return null or handle the case where no matching post is found
        return null;
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as IPost;
    } catch (error) {
      console.error("Error getting post details:", error);
      throw error; // Rethrow the error to handle it at a higher level if needed
    }
  };

  return {
    onSave,
    onDelete,
    onCreate,
    getPosts,
    searchPost,
    getPostDetail,
    getPostsByUser,
    getSavedPostsByUser
  }
}

export default usePost
