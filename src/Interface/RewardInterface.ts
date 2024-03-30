import { IPlatform } from "./PlatformInterface";

export interface IReward {
    id: string;
    platform: IPlatform
    slug: string;
    reward: number
}

export interface IRewardHistoryItem {
    id: string;
    createdAt: string;
    description?: string;
    img?: string;
    name?: string;
    price: number;
    rewardItemId?: number | string;
    type: "expense" | "income";
    rewardActionId?: string;
    platform?: IPlatform;
    slug?: string;
}

export interface IUserRewardItem {
    id: string;
    createdAt: string;
    description?: string;
    img: string;
    name: string;
    price: number;
    rewardItemId: number | string;
}