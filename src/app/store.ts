import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { api } from './services/api';
import itemCategory from './slices/itemCategory';

// const rootReducers = combineSlices(api, itemCategory);

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [itemCategory.name]: itemCategory.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
    ...options
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
