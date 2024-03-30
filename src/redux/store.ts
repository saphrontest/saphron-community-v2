import { configureStore } from '@reduxjs/toolkit'
import { modalSlice, communitySlice, userSlice, searchSlice, globalSlice } from './slices'
import { persistCombineReducers, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ['user', 'search']
}

const defaultReducer = {
  modal: modalSlice,
  community: communitySlice,
  user: userSlice,
  search: searchSlice,
  global: globalSlice
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