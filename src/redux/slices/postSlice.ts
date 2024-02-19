import { createSlice } from "@reduxjs/toolkit"
import { defaultPostState } from "../../Interface";

export const postSlice = createSlice({
  name: "postSlice",
  initialState: defaultPostState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload
    },
    setSavedPosts: (state, action) => {
      state.savedPosts = action.payload
    },
    resetPosts: (state) => {
      state = defaultPostState
    }
  },
})
export const {
    setPosts,
    setSavedPosts,
    resetPosts
} = postSlice.actions
export default postSlice.reducer
