import { TConstructorIngredient } from '@utils-types';
import reducer, {
  burgerOrder,
  initialStateConstructor
} from './constructorSlice';
import { addItem, deleteItem } from './constructorSlice';

const mockBurgerConstructor = {
  success: true,
  name: 'Флюоресцентный люминесцентный бургер',
  order: {
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093d'
    ],
    _id: '688d54bcd5ca30001cffd0be',
    number: 85621,
    price: 2964,
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2025-08-01T23:58:52.469Z',
    updatedAt: '2025-08-01T23:58:53.277Z'
  }
};

const testBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: '0'
};

const testIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  id: '0'
};

describe('constructorSlice reducer tests', () => {
  beforeEach(() => {
    initialStateConstructor;
  });

  describe('addItem action', () => {
    test('добавляет булочку в конструктор', () => {
      const result = reducer(initialStateConstructor, addItem(testBun));
      expect(result.constructorItems.bun).toMatchObject({
        ...testBun,
        type: 'bun',
        id: expect.any(String)
      });
      expect(result.constructorItems.ingredients).toEqual([]);
    });

    test('добавляет ингредиент в список ингредиентов', () => {
      const result = reducer(initialStateConstructor, addItem(testIngredient));
      expect(result.constructorItems.bun).toBeNull();
      expect(result.constructorItems.ingredients).toMatchObject([
        {
          ...testIngredient,
          type: 'main',
          id: expect.any(String)
        }
      ]);
    });
  });

  describe('deleteItem action', () => {
    test('удаляет существующий ингредиент', () => {
      const stateWithIngredient = {
        ...initialStateConstructor,
        constructorItems: {
          bun: null,
          ingredients: [testIngredient]
        }
      };

      const result = reducer(
        stateWithIngredient,
        deleteItem(testIngredient._id)
      );
      expect(result.constructorItems.ingredients).toEqual([]);
    });

    test('ничего не делает при удалении несуществующего ингредиента', () => {
      const result = reducer(
        initialStateConstructor,
        deleteItem('несуществующий-id')
      );
      expect(result.constructorItems.ingredients).toEqual([]);
    });

    describe('async thunk actions', () => {
      test('pending action', () => {
        const result = reducer(
          initialStateConstructor,
          burgerOrder.pending('', [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ])
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });

      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = reducer(
          initialStateConstructor,
          burgerOrder.rejected(errorMessage, '', [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ])
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });

      test('fulfilled action', () => {
        const result = reducer(
          initialStateConstructor,
          burgerOrder.fulfilled(mockBurgerConstructor, '', [])
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.constructorItems.bun).toBeNull();
        expect(result.constructorItems.ingredients).toEqual([]);
        expect(result.orderModalData).toEqual(mockBurgerConstructor.order);
      });
    });
  });
});
