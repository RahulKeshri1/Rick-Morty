import { createSlice, createAsyncThunk, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import { ApiPayload, CharacterItem } from '../types';
import { fetchCharactersApi } from '../services/api';
import type { RootState } from './index';

export const charactersAdapter = createEntityAdapter<CharacterItem>();

const initialState = charactersAdapter.getInitialState({
  isLoading: false,
  errMsg: null as string | null,
  currentPage: 1,
  canLoadMore: true,
  query: '',
});

export const fetchCharacters = createAsyncThunk(
  'list/fetchCharacters',
  async ({ page, searchStr }: { page: number; searchStr: string }, { rejectWithValue, signal }) => {
    try {
      const payload = await fetchCharactersApi(page, searchStr, signal);
      return payload;
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return rejectWithValue('aborted');
      }
      return rejectWithValue(e.message || 'Something went wrong');
    }
  }
);

const listSlice = createSlice({
  name: 'listData',
  initialState,
  reducers: {
    setQueryString(state, action: PayloadAction<string>) {
      state.query = action.payload;
      charactersAdapter.removeAll(state);
      state.currentPage = 1;
      state.canLoadMore = true;
    },
    resetData(state) {
      charactersAdapter.removeAll(state);
      state.currentPage = 1;
      state.canLoadMore = true;
      state.query = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.isLoading = true;
        state.errMsg = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.isLoading = false;
        const incomingItems = action.payload.results || [];

        if (state.currentPage === 1) {
          charactersAdapter.setAll(state, incomingItems);
        } else {
          charactersAdapter.addMany(state, incomingItems);
        }

        if (incomingItems.length === 0 || !action.payload.info.next) {
          state.canLoadMore = false;
        } else {
          state.currentPage += 1;
        }
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        if (action.payload === 'aborted') {
          return;
        }
        state.isLoading = false;
        state.errMsg = action.payload as string;
      });
  },
});

export const { setQueryString, resetData } = listSlice.actions;

export const listSelectors = charactersAdapter.getSelectors<RootState>(
  (state) => state.listData
);

export default listSlice.reducer;
