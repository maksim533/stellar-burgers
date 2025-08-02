import { TIngredient } from '@utils-types';
import { getIngredients } from './ingredientsSlices';
import { ingredientsState } from './ingredientsSlices';
import ingredientReducer from './ingredientsSlices';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0946',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
    image_mobile:
      'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0947',
    name: 'Плоды Фалленианского дерева',
    type: 'main',
    proteins: 20,
    fat: 5,
    carbohydrates: 55,
    calories: 77,
    price: 874,
    image: 'https://code.s3.yandex.net/react/code/sp_1.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa094a',
    name: 'Сыр с астероидной плесенью',
    type: 'main',
    proteins: 84,
    fat: 48,
    carbohydrates: 420,
    calories: 3377,
    price: 4142,
    image: 'https://code.s3.yandex.net/react/code/cheese.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/cheese-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png'
  }
];

describe('ingredient reducer tests', () => {
  let initialState: ingredientsState;

  beforeEach(() => {
    initialState = {
      ingredients: [],
      isLoading: false,
      error: null
    };
  });

  describe('async thunk actions', () => {
    test('pending action', () => {
      const result = ingredientReducer(
        initialState,
        getIngredients.pending('')
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });
    test('rejected action', () => {
      const errorMessage = new Error('Network error');
      const result = ingredientReducer(
        initialState,
        getIngredients.rejected(errorMessage, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual({
        message: 'Network error',
        name: 'Error',
        stack: expect.any(String)
      });
    });
    test('fulfilled action', () => {
      const result = ingredientReducer(
        initialState,
        getIngredients.fulfilled(mockIngredients, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.ingredients).toEqual(mockIngredients);
    });
  });
});
