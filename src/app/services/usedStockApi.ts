import { UsedStockTypes } from "@/types/itemTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usedStockApi = createApi({
    reducerPath: 'usedStockApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
      getUsedStock: builder.query<UsedStockTypes[], void>({
        query: () => 'usedStock',
      }),
      getUsedStockById: builder.query<UsedStockTypes, number>({
        query: (id) => `usedStock/${id}`,
      }),
      addUsedStock: builder.mutation<UsedStockTypes, Partial<UsedStockTypes>>({
        query: (newStock) => ({
          url: 'usedStock',
          method: 'POST',
          body: newStock,
        }),
      }),
      updateUsedStock: builder.mutation<UsedStockTypes, { id: number; update: Partial<UsedStockTypes> }>({
        query: ({ id, update }) => ({
          url: `usedStock/${id}`,
          method: 'PUT',
          body: update,
        }),
      }),
      deleteUsedStock: builder.mutation<{ success: boolean; id: number }, number>({
        query: (id) => ({
          url: `usedStock/${id}`,
          method: 'DELETE',
        }),
      }),
    }),
  });
  
  export const {
    useGetUsedStockQuery,
    useGetUsedStockByIdQuery,
    useAddUsedStockMutation,
    useUpdateUsedStockMutation,
    useDeleteUsedStockMutation,
  } = usedStockApi;