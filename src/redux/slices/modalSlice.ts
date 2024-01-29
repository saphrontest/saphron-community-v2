import { createSlice } from "@reduxjs/toolkit"
import { ModalInterface, defaultModalState } from "../../Interface/ModalInterface";
import type { PayloadAction } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: "modalSlice",
  initialState: defaultModalState,
  reducers: {
    setModal : (state, action: PayloadAction<ModalInterface>) => {
      state.view = action.payload.view;
      state.isOpen = action.payload.isOpen;
      state.data = action.payload.data
    }
  },
})
export const {
  setModal
} = modalSlice.actions
export default modalSlice.reducer
