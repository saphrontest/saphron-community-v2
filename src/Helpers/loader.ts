import { query, collection, where, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { IPost, Community } from "../Interface";
import { firestore } from "../firebaseClient";

export const getPostDetail = async (slugId: string) => {
  try {
    const q = query(
      collection(firestore, "posts"),
      where("slugId", "==", slugId),
      limit(1)
    );
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

export const getCommunityDetails = async (id: string) => {
  try {
    const communityDetailRef = doc(firestore, "communities", id);
    const community = await getDoc(communityDetailRef);
    const communityObject = { id: community.id, ...community.data() };
    return communityObject as Community;
  } catch (error) {
    console.error("Error getting community details:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};




// import { query, collection, where, limit, getDocs, doc, getDoc } from "firebase/firestore";
// import { IPost, Community } from "../Interface";
// import { firestore } from "../firebaseClient";
// import { LoaderFunctionArgs } from "react-router-dom";

// export const postDetailLoader = async ({ params: { slugId } }: LoaderFunctionArgs) => {
//   try {
//     const q = query(
//       collection(firestore, "posts"),
//       where("slugId", "==", slugId),
//       limit(1)
//     );
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.size === 0) {
//       // Return null or handle the case where no matching post is found
//       return null;
//     }

//     const doc = querySnapshot.docs[0];
//     return { id: doc.id, ...doc.data() } as IPost;
//   } catch (error) {
//     console.error("Error getting post details:", error);
//     throw error; // Rethrow the error to handle it at a higher level if needed
//   }
// };

// export const communityDetailLoader = async ({ params: { communityId } }: LoaderFunctionArgs) => {
//   try {
//     const communityDetailRef = doc(firestore, "communities", communityId as string);
//     const community = await getDoc(communityDetailRef);
//     const communityObject = { id: community.id, ...community.data() };
//     return communityObject as Community;
//   } catch (error) {
//     console.error("Error getting community details:", error);
//     throw error; // Rethrow the error to handle it at a higher level if needed
//   }
// };