import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Community, JoinedCommunity, communitySliceInitial } from "../../Interface"

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
    },
    resetCommunities: (state, action: PayloadAction) => {
      state = communitySliceInitial
    }
  },
})
export const {
  setCommunities,
  setSelectedCommunity,
  setJoinedCommunities,
  resetCommunities
} = communitiySlice.actions
export default communitiySlice.reducer
