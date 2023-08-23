import { query, collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseClient";

const fetchData = async (queryString: string) => {
  const q = query(collection(firestore, queryString))
  const data = await getDocs(q);
  return data
}

export const getCommunities = async () => {
  const communitiesData = await fetchData("communities");
  return communitiesData.docs.map(doc => ({ name: doc.id, ...doc.data() }));
}