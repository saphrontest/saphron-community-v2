import { writeBatch, doc, collection, increment, deleteDoc, collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { IComment, IPost, IUser } from '../Interface';
import { firestore } from '../firebaseClient';

/**
 * The `useComment` custom hook in a TypeScript React application provides functions to create, delete
 * comments, and retrieve comments based on a post ID.
 * @returns An object is being returned from the `useComment` function. This object contains three
 * properties:
 */

const useComment = () => {

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
  const onCreate = async (post: IPost, user: IUser, comment: string) => {
    const batch = writeBatch(firestore);

    // Create comment document
    const commentDocRef = doc(collection(firestore, "comments"));
    batch.set(commentDocRef, {
      postId: post.id,
      creatorId: user.id,
      creatorDisplayText: user.email.split("@")[0],
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
  const onDelete = async (commentId: string, postId: string) => {
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

/**
 * This function retrieves comments based on a given post ID in a TypeScript React application.
 * @param {string} postId - The `postId` parameter is a string that represents the unique identifier of
 * a post. The function `getCommentByPostId` is designed to retrieve comments associated with a
 * specific post based on this `postId`.
 * @returns An array of comments related to the specified postId is being returned. Each comment object
 * in the array contains an id field representing the document id in Firestore and other data fields
 * from the document.
 */
  const getCommentByPostId = async (postId: string) => {
    const q = query(collection(firestore, "comments"), where("postId", "==", postId));
    const commentsDocs = await getDocs(q);
    const comments: IComment[] = commentsDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as IComment
    });
    return comments;
  };

  return {
    onCreate,
    onDelete,
    getCommentByPostId
  }

}

export default useComment
