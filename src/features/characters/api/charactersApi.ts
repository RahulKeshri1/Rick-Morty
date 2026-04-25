import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@env';
import { ApiPayload } from '@/types';

const API_BASE_URL = API_URL || 'https://rickandmortyapi.com/api/character/';

export const charactersApi = createApi({
  reducerPath: 'charactersApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getCharacters: builder.query<ApiPayload, { page: number; name: string }>({
      query: ({ page, name }) => `?page=${page}&name=${name}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Cache completely separate feeds based on the search query
        return `${endpointName}-${queryArgs.name}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        currentCache.results.push(...newItems.results);
        currentCache.info = newItems.info;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.name !== previousArg?.name;
      }
    }),
  }),
});

export const { useGetCharactersQuery } = charactersApi;
