import { Timestamp } from "firebase/firestore";

export type IPost = {
  id: string;
  communityId: string;
  communityImageURL?: string;
  userDisplayText: string; // change to authorDisplayText
  creatorId: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  currentUserVoteStatus?: {
    id: string;
    voteValue: number;
  };
  imageURL?: string;
  postIdx?: number;
  createdAt?: Timestamp;
  editedAt?: Timestamp;
  slug?: string;
  slugId: string;
};

export type IPostVote = {
  id?: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  posts: IPost[];
  postVotes: IPostVote[];
  savedPosts: string[];
}

export const defaultPostState: PostState = {
  posts: [],
  postVotes: [],
  savedPosts: [],
};
