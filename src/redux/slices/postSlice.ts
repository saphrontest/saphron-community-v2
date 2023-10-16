import { createSlice } from "@reduxjs/toolkit"
import { defaultPostState } from "../../Interface/PostInterface";

export const postSlice = createSlice({
  name: "postSlice",
  initialState: defaultPostState,
  reducers: {
    setPosts: (state, action) => {
        state.posts = action.payload
    },
    setSavedPosts: (state, action) => {
        state.savedPosts = action.payload
    }
  },
})
export const {
    setPosts,
    setSavedPosts
} = postSlice.actions
export default postSlice.reducer
