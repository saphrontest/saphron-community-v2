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
} from "firebase/firestore";
import { firestore } from "../firebaseClient";
// INTERFACES
import { Community, JoinedCommunity } from "../Interface/CommunityInterface";
import { Post, PostVote } from "../Interface/PostInterface";
import { Comment, CommentVote } from "../Interface/CommentsInterface";
import { store } from "../redux/store";
import { setPosts, setSavedPosts } from "../redux/slices/postSlice";

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
      voteStatus: doc.data().voteStatus
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

export const getPostDetails = async (id: string) => {
  const post = await fetch.getDetail("posts", id);
  const postObject = { id: post.id, ...post.data() };
  return postObject as Post;
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

  try {
    await setDoc(joinCommunityRef, { communityId, isModerator: false })
    return true
  } catch (err) {
    return false
  }


}

export const leaveCommunity = async (userId: string, communityId: string) => {

  const communityRef = doc(firestore, "users", userId, "communities", communityId);

  try {
    await deleteDoc(communityRef)
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
