export type Comment = {
    id?: string;
    creatorId: string;
    creatorDisplayText: string;
    creatorPhotoURL: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt?: string;
    voteValue?: number;
  }

export type CommentVote = {
    id?: string;
    creatorId: string;
    postId?: string;
    commentId?: string;
    value: number;
  }