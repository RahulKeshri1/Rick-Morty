import { ApiPayload } from '../types';
import { API_URL } from '@env';

export const API_BASE_URL = API_URL;

export const fetchCharactersApi = async (page: number, searchStr: string, signal?: AbortSignal): Promise<ApiPayload> => {
  const endpoint = `${API_BASE_URL}?page=${page}&name=${searchStr}`;
  const res = await fetch(endpoint, { signal });

  if (!res.ok) {
    if (res.status === 404) {
      // rick and morty api returns 404 when no results found for search
      return { results: [], info: { count: 0, pages: 0, next: null, prev: null } };
    }
    throw new Error(`Failed to grab data`);
  }

  const rawPayload: ApiPayload = await res.json();
  return rawPayload;
};
