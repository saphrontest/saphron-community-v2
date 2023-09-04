import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Community, communitySliceInitial } from "../../Interface/CommunityInterface"

export const communitiySlice = createSlice({
  name: "communitySlice",
  initialState: communitySliceInitial,
  reducers: {
    setCommunities: (state, action: PayloadAction<Community[]>) => {
      state.communities = action.payload
    },
    setSelectedCommunity: (state, action: PayloadAction<Community>) => {
      state.selectedCommunity = action.payload
    }
  },
})
export const {
  setCommunities,
  setSelectedCommunity
} = communitiySlice.actions
export default communitiySlice.reducer
