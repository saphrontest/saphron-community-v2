import { configureStore } from '@reduxjs/toolkit'
import { modalSlice, communitySlice } from './slices'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    community: communitySlice,
  },
})

export type RootState = ReturnType<typeof store.getState>;