import { createSlice } from "@reduxjs/toolkit"
import { defaultUserState } from "../../Interface/UserInterface"

export const userSlice = createSlice({
  name: "userSlice",
  initialState: defaultUserState,
  reducers: {
    setUserInfo: (state, action) => {
        return { ...state, ...action.payload };
    }
  },
})
export const { setUserInfo } = userSlice.actions
export default userSlice.reducer
