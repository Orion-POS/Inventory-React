import { ItemCategoryEntity } from '@/__dummy__/sampleItemCategory';
import { api } from './api';

export const itemCategoryApi = api.injectEndpoints({
  endpoints: build => ({
    getItemCategories: build.query<ItemCategoryEntity[], void>({
      query: () => {
        console.log(' FETCHING')
        return {
          url: 'item_categories'
        }
      },
      transformResponse: (res: any, meta) => {
        console.log(res, '<< RESS')
        return res
      },
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Item Categories', id } as const)),
        { type: 'Item Categories' as const, id: 'LIST' }
      ]
    })
  })
});

export const { useGetItemCategoriesQuery } = itemCategoryApi;
