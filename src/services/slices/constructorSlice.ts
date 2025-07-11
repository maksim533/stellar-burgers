import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export interface constructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  isLoading: boolean;
  orderModalData: null | TOrder;
  error: null | string;
}

const initialState: constructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const burgerOrder = createAsyncThunk(
  'constructorItem/order',
  (data: string[]) => orderBurgerApi(data)
);

const constructorSlice = createSlice({
  name: 'constructorItem',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    deleteItem: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient._id !== action.payload
        );
    },
    MoveUp: (state, action) => {
      state.constructorItems.ingredients = [
        ...state.constructorItems.ingredients.slice(0, action.payload - 1),
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload - 1],
        ...state.constructorItems.ingredients.slice(action.payload + 1)
      ];
    },
    MoveDown: (state, action) => {
      state.constructorItems.ingredients = [
        ...state.constructorItems.ingredients.slice(0, action.payload),
        state.constructorItems.ingredients[action.payload + 1],
        state.constructorItems.ingredients[action.payload],
        ...state.constructorItems.ingredients.slice(action.payload + 2)
      ];
    },
    closeModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectConstructorItems: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(burgerOrder.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.orderRequest = true;
      })
      .addCase(burgerOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.orderRequest = false;
      })
      .addCase(burgerOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
      });
  }
});
export const { addItem, deleteItem, MoveUp, MoveDown, closeModal } =
  constructorSlice.actions;
export const { selectConstructorItems } = constructorSlice.selectors;
export default constructorSlice.reducer;
