import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Community, JoinedCommunity, communitySliceInitial } from "../../Interface/CommunityInterface"

export const communitiySlice = createSlice({
  name: "communitySlice",
  initialState: communitySliceInitial,
  reducers: {
    setCommunities: (state, action: PayloadAction<Community[]>) => {
      state.communities = action.payload
    },
    setSelectedCommunity: (state, action: PayloadAction<Community>) => {
      state.selectedCommunity = action.payload
    },
    setJoinedCommunities: (state, action: PayloadAction<JoinedCommunity[]>) => {
     state.joinedCommunities = action.payload
    }
  },
})
export const {
  setCommunities,
  setSelectedCommunity,
  setJoinedCommunities
} = communitiySlice.actions
export default communitiySlice.reducer