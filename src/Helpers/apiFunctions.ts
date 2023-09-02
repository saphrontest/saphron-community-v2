import { query, collection, getDocs, doc, getDoc, where } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { Community } from "../Interface/CommunityInterface";
import { Post } from "../Interface/PostInterface";
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

export const getPostDetails = async (id: string) => {
  const post = await fetch.getDetail("posts", id)
  const postObject = { id: post.id, ...post.data() }
  return postObject as Post
}

export const getPostComments = async (id: string) => {
  const comments: (Comment | null)[] = []
  console.log(typeof comments)
  const commentsDocs = await fetch.getListWhere("comments", where("postId", "==", id))
  commentsDocs.docs.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() } as Comment)
  })
  return comments
}
