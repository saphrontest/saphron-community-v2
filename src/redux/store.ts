import { configureStore } from '@reduxjs/toolkit'
import { modalSlice, communitySlice, postSlice, userSlice } from './slices'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    community: communitySlice,
    post: postSlice,
    user: userSlice
  },
})

export type RootState = ReturnType<typeof store.getState>;