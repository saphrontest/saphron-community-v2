import { Timestamp } from "firebase/firestore";

export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "restrictied" | "private";
    createdAt?: Timestamp;
    imageURL?: string;
}

export const defaultCommunity: Community = {
    id: "",
    creatorId: "",
    numberOfMembers: 0,
    privacyType: "public",
    imageURL: ""
};