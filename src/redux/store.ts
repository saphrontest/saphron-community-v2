import { configureStore } from '@reduxjs/toolkit'
import { modalSlice, communitySlice, postSlice } from './slices'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    community: communitySlice,
    post: postSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>;