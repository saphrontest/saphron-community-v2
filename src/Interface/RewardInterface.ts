import { IPlatform } from "./PlatformInterface";

export interface IReward {
    id: string;
    platform: IPlatform
    slug: string;
    reward: number
}

export interface IRewardHistoryExpenseItem {
    createdAt: string;
    description: string;
    img: string;
    name: string;
    price: number;
    rewardItemId: number | string;
    type: "expense"
}

export interface IRewardHistoryIncomeItem {
    createdAt: string;
    platform: IPlatform;
    price: number;
    rewardActionId: string;
    slug: string;
    type: "income";
}