import { configureStore } from '@reduxjs/toolkit'
import { modalSlice } from './slices'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>;