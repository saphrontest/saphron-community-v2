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
  increment
} from "firebase/firestore";
import { firestore } from "../firebaseClient";
// INTERFACES
import { Community, JoinedCommunity } from "../Interface/CommunityInterface";
import { Post, PostVote } from "../Interface/PostInterface";
import { Comment, CommentVote } from "../Interface/CommentsInterface";
import { store } from "../redux/store";
import { setPosts, setSavedPosts } from "../redux/slices/postSlice";
import { User } from "firebase/auth";
import { setUserInfo } from "../redux/slices/userSlice";
import { Workshop, WorkshopRequest } from "../Interface/WorkshopInterface";

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

export const getPosts = async () => {
  const postDocs = await fetch.getList("posts");
  const posts = postDocs.docs.map((doc) => {
    return {
      id: doc.id,
      createdAt: {
        nanoseconds: doc.data().createdAt.nanoseconds,
        seconds: doc.data().createdAt.seconds,
      },
      editedAt: {
        nanoseconds: doc.data().editedAt.nanoseconds,
        seconds: doc.data().editedAt.seconds,
      },
      body: doc.data().body,
      communityId: doc.data().communityId,
      communityImageURL: doc.data().communityImageURL,
      creatorId: doc.data().creatorId,
      numberOfComments: doc.data().numberOfComments,
      title: doc.data().title,
      userDisplayText: doc.data().userDisplayText,
      voteStatus: doc.data().voteStatus,
      slug: doc.data().slug
    };
  });
  store.dispatch(setPosts(posts))
};

export const getPostsByCommunities = async (id: string) => {
  const posts: Post[] = [];
  const postsDoc = await fetch.getListWhere(
    "posts",
    where("communityId", "==", id)
  );
  postsDoc.docs.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as Post);
  });
  return posts;
};

export const getPostDetails = async (slug: string) => {
  let post = {}
  const q = query(collection(firestore, "posts"), where("slug", "==", slug));
  const data = await getDocs(q);
  data.forEach(doc => post = { id: doc.id, ...doc.data() } as Post)
  return post
};

export const getCommunityDetail = async (id: string) => {
  const community = await fetch.getDetail("communities", id);
  const communityObject = { id: community.id, ...community.data() };
  return communityObject as Community;
};

export const getPostComments = async (id: string) => {
  const comments: (Comment | null)[] = [];
  const commentsDocs = await fetch.getListWhere(
    "comments",
    where("postId", "==", id)
  );
  commentsDocs.docs.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() } as Comment);
  });
  return comments;
};

export const getUserVotes = async (id: string) => {
  if(!id) return;
  const postVotes = await fetch.getList(`users/${id}/postVotes`);
  if (postVotes.size) {
    const votes: PostVote[] = [];
    postVotes.forEach((doc) => {
      votes.push({ id: doc.id, ...doc.data() } as PostVote);
    });
    return votes;
  }
  return false;
};

export const getWorkshops = async () => {
  const workshopsRef = await fetch.getList(`workshops`);
  if (workshopsRef.size) {
    const workshops: Workshop[] = [];
    workshopsRef.forEach((doc) => {
      workshops.push({ id: doc.id, ...doc.data() } as Workshop);
    });
    return workshops;
  }
  return false;
};

export const getUserWorkshopRequestList = async (userId: string) => {
  const workshopsRef = await fetch.getList(`users/${userId}/workshopJoinRequests`);
  if (workshopsRef.size) {
    const workshops: WorkshopRequest[] = [];
    workshopsRef.forEach((doc) => {
      workshops.push({ id: doc.id, ...doc.data() } as WorkshopRequest);
    });
    return workshops;
  }
  return false;
}

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

  const joinCommunityRef = doc(firestore, "users", userId, "communities", communityId);
  const communityRef = doc(firestore, "communities", communityId)
  
  try {
    await setDoc(joinCommunityRef, { communityId, isModerator: false })
    const batch = writeBatch(firestore)
    batch.update(communityRef, {
      numberOfMembers: increment(+1)
    })
    batch.commit()
    return true
  } catch (err) {
    return false
  }


}

export const leaveCommunity = async (userId: string, communityId: string) => {

  const userCommunityRef = doc(firestore, "users", userId, "communities", communityId);
  const communityRef = doc(firestore, "communities", communityId)
  
  try {
    await deleteDoc(userCommunityRef)
    const batch = writeBatch(firestore)
    batch.update(communityRef, {
      numberOfMembers: increment(-1)
    })
    batch.commit()
    return true
  } catch (err) {
    return false
  }


}

export const getCommentVotesByUserId = async (id: string) => {
  const commentVotes = await fetch.getList(`users/${id}/commentVotes`);
  if (commentVotes.size) {
    const votes: CommentVote[] = [];
    commentVotes.forEach((doc) => {
      votes.push({ id: doc.id, ...doc.data() } as CommentVote);
    });
    return votes;
  }
  return [];
};


export const savePost = async (post: Post, userId: string) => {
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

};

export const getUserSavedPosts = async (userId: string) => {
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
        savedPosts.push(data);
      });
      store.dispatch(setSavedPosts(savedPosts))
    })
    .catch((error) => {
      console.error("Error getting documents:", error);
    });
};

export const getUserCommunities = async (userId: string) => {
  const userCommunitiesCollection = collection(firestore, "users", userId, "communities");
  const q = query(userCommunitiesCollection);
  const comm: any[] = []
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((docSnapshot: any) => {
    const data = docSnapshot.data();
    comm.push(data)
  });
  return comm
  
}

export const searchPost = async (keyword: string) => {
  
  if(!!keyword === false) return;
  
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

  const bodyResults: Post[] = [];
  bodySnap.forEach((doc) => {
    bodyResults.push({ id: doc.id, ...doc.data() } as Post);
  });

  const titleResults: Post[] = [];
  titleSnap.forEach((doc) => {
    titleResults.push({ id: doc.id, ...doc.data() } as Post);
  });
  const results = [...bodyResults, ...titleResults];
  return results
}

export const getPostsByUser = async (creatorId: string) => {
  const posts: Post[] = []
  const postsDoc = await fetch.getListWhere("posts", where("creatorId", "==", creatorId))
  postsDoc.docs.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as Post);
  });
  return posts;
}

const generateUsername = (email: string) => {
  return email.split("@")[0].toLowerCase() ?? ""
}

export const saveUserToFirestore = async (provider: string | null, user: User) => {
  
  try {

    const batch = writeBatch(firestore);
    const userDocRef = doc(firestore, 'users', user.uid);

    const docSnapshot = await getDoc(userDocRef);

    if(docSnapshot.data()?.isRegistered){
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
      provider
    }

    // Use the batch to set the data for the new user
    batch.set(userDocRef, newUser);

    // Commit the batch to Firestore
    await batch.commit();
    
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const updateUser = async (userId: string, value: object) => {
  try {
    const batch = writeBatch(firestore);
    const userRef = doc(firestore, "users", userId);
    batch.update(userRef, value);
    await batch.commit();
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const getUser = async (userId: string) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const docSnapshot = await getDoc(userDocRef);
    const data = docSnapshot.data();
    if(data?.isRegistered){
      store.dispatch(setUserInfo({id: userId, ...data}));
    }
  } catch (error) {
    console.error(error)
  }
}