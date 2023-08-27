import { query, collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { Community } from "../Interface/CommunityInterface";
import { Post } from "../Interface/PostInterface";

const fetchData = async (queryString: string) => {
  const q = query(collection(firestore, queryString))
  const data = await getDocs(q);
  return data
}

export const getCommunities = async () => {
  const communities: Community[] = []
  const communitiesData = await fetchData("communities");
  communitiesData.forEach(doc => {
    const { creatorId, createdAt, numberOfMembers, privacyType, name } = doc.data()
    communities.push({id: doc.id, creatorId, createdAt, numberOfMembers, privacyType, name});
  });
  return communities;
}

export const getPosts = async () => {
  const postDocs = await fetchData("posts");
  const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts as Post[]
}

getPosts()