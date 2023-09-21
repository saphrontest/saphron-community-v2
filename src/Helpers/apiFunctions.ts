// FIREBASE
import { query, collection, getDocs, doc, getDoc, where } from "firebase/firestore";
import { firestore } from "../firebaseClient";
// INTERFACES
import { Community } from "../Interface/CommunityInterface";
import { Post, PostVote } from "../Interface/PostInterface";
import { Comment } from "../Interface/CommentsInterface";

const fetch = {
  getDetail: async (query: string, id:string) => {
    const detailRef = doc(firestore, query, id as string);
    const detail = await getDoc(detailRef);
    return detail
  },
  getList: async (queryString: string) => {
    const q = query(collection(firestore, queryString))
    const data = await getDocs(q);
    return data
  },
  getListWhere: async (queryString: string, _where: any) => {
    const q = query(collection(firestore, queryString), _where);
    const data = await getDocs(q);
    return data
  }
}

export const getCommunities = async () => {
  const communities: Community[] = []
  const communitiesData = await fetch.getList("communities");
  communitiesData.forEach(doc => {
    const { creatorId, createdAt, numberOfMembers, privacyType, name } = doc.data()
    communities.push({id: doc.id, creatorId, createdAt, numberOfMembers, privacyType, name});
  });
  return communities;
}

export const getPosts = async () => {
  const postDocs = await fetch.getList("posts");
  const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts as Post[]
}

export const getPostsByCommunities = async (id: string) => {
  const posts: Post[] = []
  const postsDoc = await fetch.getListWhere("posts", where("communityId", "==", id))
  postsDoc.docs.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as Post)
  })
  return posts
}

export const getPostDetails = async (id: string) => {
  const post = await fetch.getDetail("posts", id)
  const postObject = { id: post.id, ...post.data() }
  return postObject as Post
}

export const getCommunityDetail = async (id: string) => {
  const community = await fetch.getDetail("communities", id)
  const communityObject = { id: community.id, ...community.data() }
  return communityObject as Community
}

export const getPostComments = async (id: string) => {
  const comments: (Comment | null)[] = []
  const commentsDocs = await fetch.getListWhere("comments", where("postId", "==", id))
  commentsDocs.docs.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() } as Comment)
  })
  return comments
}

export const getUserVotes = async (id: string) => {
  const postVotes = await fetch.getList(`users/${id}/postVotes`)
  if(postVotes.size){
    const votes: PostVote[] = []
    postVotes.forEach(doc => {
      votes.push({ id: doc.id, ...doc.data() } as PostVote)
    })
    return votes
  }
  return false
}
