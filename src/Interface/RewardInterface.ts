import { IPlatform } from "./PlatformInterface";

export interface IReward {
    id: string;
    platform: IPlatform
    slug: string;
    reward: number
}