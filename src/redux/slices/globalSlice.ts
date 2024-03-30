import { createSlice } from "@reduxjs/toolkit"

export const globalSlice = createSlice({
  name: "globalSlice",
  initialState: {
    userMenuOpen: false,
    communitySelectOpen: false
  },
  reducers: {
    setUserMenuOpen: (state, action) => {
      state.userMenuOpen = action.payload
    },
    setCommunitySelectOpen: (state, action) => {
      state.communitySelectOpen = action.payload
    }
  },
})
export const { setUserMenuOpen, setCommunitySelectOpen } = globalSlice.actions
export default globalSlice.reducer
