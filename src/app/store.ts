import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { usedStockApi } from './services/usedStockApi'
import usedStockReducer from './services/usedStock';

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      usedStock: usedStockReducer,
      [usedStockApi.reducerPath]: usedStockApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector