import { Timestamp } from "firebase/firestore";

export interface Community {
    id: string;
    creatorId: string;
    name: string;
    numberOfMembers: number;
    privacyType: "public" | "restrictied" | "private";
    createdAt?: Timestamp;
    imageURL?: string;
}

export const defaultCommunity: Community = {
    id: "",
    name: "",
    creatorId: "",
    numberOfMembers: 0,
    privacyType: "public",
    imageURL: ""
};

interface CommunitySlice {
    communities: Community[]
}

export const communitySliceInitial: CommunitySlice = {
    communities: []
} 