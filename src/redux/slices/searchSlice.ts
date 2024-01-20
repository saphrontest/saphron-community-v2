import { createSlice } from "@reduxjs/toolkit"
import { defaultSearchState } from "../../Interface/SearchInterface"

export const searchSlice = createSlice({
  name: "searchSlice",
  initialState: defaultSearchState,
  reducers: {
    setRecentSearches: (state, action) => {
      if(!!state.recentSearches.some(item => item.id === action.payload.id) === false) {
        state.recentSearches.push(action.payload)
      }
    }
  },
})
export const {
  setRecentSearches
} = searchSlice.actions
export default searchSlice.reducer
