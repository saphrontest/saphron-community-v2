import { Timestamp } from "firebase/firestore";

export type Comment = {
    id?: string;
    creatorId: string;
    creatorDisplayText: string;
    creatorPhotoURL: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt?: Timestamp;
    voteValue?: number;
  } | null;

export type CommentVote = {
    id?: string;
    creatorId: string;
    postId?: string;
    commentId?: string;
    value: number;
  } | null;