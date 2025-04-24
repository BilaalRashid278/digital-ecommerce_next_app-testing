import { api } from '@/lib/rtk-client'
import { configureStore } from '@reduxjs/toolkit'
import updateProductReducer from '@/slices/update.product';
import selectedProductReducer from '@/slices/selected.product';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    updateProduct: updateProductReducer,
    selectedProduct: selectedProductReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch