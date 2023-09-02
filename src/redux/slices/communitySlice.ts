import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Community, communitySliceInitial } from "../../Interface/CommunityInterface"

export const communitiySlice = createSlice({
  name: "communitySlice",
  initialState: communitySliceInitial,
  reducers: {
    setCommunities: (state, action: PayloadAction<Community[]>) => {
      state.communities = action.payload
    }
  },
})
export const {
  setCommunities
} = communitiySlice.actions
export default communitiySlice.reducer
