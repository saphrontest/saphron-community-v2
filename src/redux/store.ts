import { configureStore } from '@reduxjs/toolkit'
import { modalSlice, communitySlice, postSlice, userSlice } from './slices'
import { persistCombineReducers, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ['user']
}

const defaultReducer = {
  modal: modalSlice,
  community: communitySlice,
  post: postSlice,
  user: userSlice
}

export const store = configureStore({
  reducer: persistCombineReducers(persistConfig, defaultReducer),
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    });
  }
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;