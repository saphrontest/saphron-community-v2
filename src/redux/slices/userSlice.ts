import { createSlice } from "@reduxjs/toolkit"
import { defaultUserState } from "../../Interface/UserInterface"

export const userSlice = createSlice({
  name: "userSlice",
  initialState: defaultUserState,
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    logoutUser: (state) => {
      return { ...state, ...defaultUserState };
    }
  },
})
export const { setUserInfo, logoutUser } = userSlice.actions
export default userSlice.reducer
