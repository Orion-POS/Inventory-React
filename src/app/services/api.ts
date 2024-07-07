import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

/**
 * see @url https://redux-toolkit.js.org/rtk-query/usage/examples for example
 */

const BASE_API_URL = import.meta.env.VITE_BASE_URL_API;



// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    // const token = (getState() as RootState)?.auth?.token;
    // if (token) {
    //   headers.set('authentication', `Bearer ${token}`);
    // }
    return headers;
  }
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

export const api = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRetry,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: ['Item Categories'],
  endpoints: () => ({})
});

console.log(api.middleware)
