import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export interface ingredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: null | string;
}

const initialState: ingredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredient/get',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    selectIngredientState: (state) => state,
    selectIsLoading: (state) => state.isLoading,
    selectIngredients: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { selectIngredientState, selectIsLoading, selectIngredients } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
