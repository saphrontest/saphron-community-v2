import { IPost } from "./PostInterface";

export type SearchItemInterface = IPost
export type RecentSearchsInterface = SearchItemInterface[]

interface SearchStateInterface {
    recentSearches: RecentSearchsInterface;
}

export const defaultSearchState: SearchStateInterface = {
    recentSearches: []
}