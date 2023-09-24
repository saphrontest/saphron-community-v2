import { createSlice } from "@reduxjs/toolkit"
import { defaultPostState } from "../../Interface/PostInterface";

export const postSlice = createSlice({
  name: "postSlice",
  initialState: defaultPostState,
  reducers: {
    setPosts: (state, action) => {
        state.posts = action.payload
    },
    addSavedPosts: (state, action) => {
        state.savedPosts.push(action.payload)
    }
  },
})
export const {
    setPosts,
    addSavedPosts
} = postSlice.actions
export default postSlice.reducer
