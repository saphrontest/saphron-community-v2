// FIREBASE
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  where,
  setDoc,
  deleteDoc,
  writeBatch,
  increment,
} from "firebase/firestore";
import { firestore } from "../firebaseClient";
// INTERFACES
import { Community, JoinedCommunity, IPost, IPostVote, ICommentVote, IUser, IBlockedUser } from "../Interface";
import { store } from "../redux/store";
import { User } from "firebase/auth";
import { setUserInfo } from "../redux/slices/userSlice";

const fetch = {
  getDetail: async (query: string, id: string) => {
    const detailRef = doc(firestore, query, id as string);
    const detail = await getDoc(detailRef);
    return detail;
  },
  getList: async (queryString: string) => {
    const q = query(collection(firestore, queryString));
    const data = await getDocs(q);
    return data;
  },
  getListWhere: async (queryString: string, _where: any) => {
    const q = query(collection(firestore, queryString), _where);
    const data = await getDocs(q);
    return data;
  },
};

export const getCommunities = async () => {
  const communities: Community[] = [];
  const communitiesData = await fetch.getList("communities");
  communitiesData.forEach((doc) => {
    const { creatorId, createdAt, numberOfMembers, privacyType, name } =
      doc.data();
    communities.push({
      id: doc.id,
      creatorId,
      createdAt,
      numberOfMembers,
      privacyType,
      name,
    });
  });
  return communities;
};

export const getPostsByCommunities = async (id: string) => {
  const posts: IPost[] = [];
  const postsDoc = await fetch.getListWhere(
    "posts",
    where("communityId", "==", id)
  );
  postsDoc.docs.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as IPost);
  });
  return posts;
};

export const getCommunityDetail = async (id: string) => {
  const community = await fetch.getDetail("communities", id);
  const communityObject = { id: community.id, ...community.data() };
  return communityObject as Community;
};

export const getUserVotes = async (id: string) => {
  if (!id) return;
  const postVotes = await fetch.getList(`users/${id}/postVotes`);
  if (postVotes.size) {
    const votes: IPostVote[] = [];
    postVotes.forEach((doc) => {
      votes.push({ id: doc.id, ...doc.data() } as IPostVote);
    });
    return votes;
  }
  return false;
};

export const getJoinedCommunitiesList = async (id: string) => {
  const joinedCommunitiesDocs = await fetch.getList(`users/${id}/communities`);
  if (joinedCommunitiesDocs.size) {
    const joinedCommunities: JoinedCommunity[] = [];
    joinedCommunitiesDocs.forEach((doc) => {
      joinedCommunities.push(doc.data() as JoinedCommunity);
    });
    return joinedCommunities;
  }
  return false;
};

export const joinCommunity = async (userId: string, communityId: string) => {
  const joinCommunityRef = doc(
    firestore,
    "users",
    userId,
    "communities",
    communityId
  );
  const communityRef = doc(firestore, "communities", communityId);

  try {
    await setDoc(joinCommunityRef, { communityId, isModerator: false });
    const batch = writeBatch(firestore);
    batch.update(communityRef, {
      numberOfMembers: increment(+1),
    });
    batch.commit();
    return true;
  } catch (err) {
    return false;
  }
};

export const leaveCommunity = async (userId: string, communityId: string) => {
  const userCommunityRef = doc(
    firestore,
    "users",
    userId,
    "communities",
    communityId
  );
  const communityRef = doc(firestore, "communities", communityId);

  try {
    await deleteDoc(userCommunityRef);
    const batch = writeBatch(firestore);
    batch.update(communityRef, {
      numberOfMembers: increment(-1),
    });
    batch.commit();
    return true;
  } catch (err) {
    return false;
  }
};

export const getCommentVotesByUserId = async (id: string) => {
  const commentVotes = await fetch.getList(`users/${id}/commentVotes`);
  if (commentVotes.size) {
    const votes: ICommentVote[] = [];
    commentVotes.forEach((doc) => {
      votes.push({ id: doc.id, ...doc.data() } as ICommentVote);
    });
    return votes;
  }
  return [];
};

export const getUserCommunities = async (userId: string) => {
  const userCommunitiesCollection = collection(
    firestore,
    "users",
    userId,
    "communities"
  );
  const q = query(userCommunitiesCollection);
  const comm: any[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnapshot: any) => {
    const data = docSnapshot.data();
    comm.push(data);
  });
  return comm;
};

const generateUsername = (email: string) => {
  return email.split("@")[0].toLowerCase() ?? "";
};

export const saveUserToFirestore = async (
  provider: string | null,
  user: User
) => {
  try {
    const batch = writeBatch(firestore);
    const userDocRef = doc(firestore, "users", user.uid);

    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.data()?.isRegistered) {
      return;
    }

    const newUser = {
      username: generateUsername(user?.email ?? ""),
      email: user?.email,
      coverPhoto: "",
      profilePhoto: "",
      displayName: "",
      phoneNumber: "",
      emailVerified: false,
      isRegistered: true,
      provider,
    };

    // Use the batch to set the data for the new user
    batch.set(userDocRef, newUser);

    // Commit the batch to Firestore
    await batch.commit();
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const updateUser = async (userId: string, value: object) => {
  try {
    const batch = writeBatch(firestore);
    const userRef = doc(firestore, "users", userId);
    batch.update(userRef, value);
    await batch.commit();
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getUser = async (userId: string, type: "" | "query" = "") => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const docSnapshot = await getDoc(userDocRef);
    const data = docSnapshot.data();
    if(data?.isRegistered){
      if(type === 'query') {
        return {id: userId, ...data} as IUser
      }
      store.dispatch(setUserInfo({id: userId, ...data} as IUser));
    }
  } catch (error) {
    console.error(error);
  }
}

export const getBlockedUsersByUserId = async (userId: string) => {
  const blockedDoc = query(collection(firestore, `users/${userId}/blockedUsers`))
  const docSnapshot = await getDocs(blockedDoc)

  return docSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as IBlockedUser))
}
