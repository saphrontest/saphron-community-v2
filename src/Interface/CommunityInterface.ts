import { Timestamp } from "firebase/firestore";

export interface Community {
    id: string;
    creatorId: string;
    name: string;
    description?: string;
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
    imageURL: "",
    description: ""
};

interface CommunitySlice {
    communities: Community[]
    selectedCommunity: Community | null
}

export const communitySliceInitial: CommunitySlice = {
    communities: [],
    selectedCommunity: null
} 