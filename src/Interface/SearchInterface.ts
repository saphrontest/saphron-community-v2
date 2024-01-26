import { Post } from "./PostInterface";

export type SearchItemInterface = Post
export type RecentSearchsInterface = SearchItemInterface[]

interface SearchStateInterface {
    recentSearches: RecentSearchsInterface;
}

export const defaultSearchState: SearchStateInterface = {
    recentSearches: []
}