import { TOrdersData } from '@utils-types';
import { getOrderByNumber, getOrders, initialState } from './orderSlice';
import orderReducer from './orderSlice';

const mockOrder: TOrdersData = {
  orders: [
    {
      _id: '688a394bd5ca30001cffc985',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-07-30T15:24:59.984Z',
      updatedAt: '2025-07-30T15:25:00.731Z',
      number: 85386
    }
  ],
  total: 85238,
  totalToday: 101
};

const mockOrderByNumber = {
  success: true,
  orders: [
    {
      _id: '688a394bd5ca30001cffc985',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      owner: '688a20fcd5ca30001cffc938',
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-07-30T15:24:59.984Z',
      updatedAt: '2025-07-30T15:25:00.731Z',
      number: 85386,
      __v: 0
    }
  ]
};

describe('order reducer tests', () => {
  beforeEach(() => {
    initialState;
  });

  describe('async thunk actions getOrders', () => {
    test('pending action ', () => {
      const result = orderReducer(initialState, getOrders.pending(''));
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });
    test('rejected action', () => {
      const errorMessage = new Error('Network error');
      const result = orderReducer(
        initialState,
        getOrders.rejected(errorMessage, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual({
        message: 'Network error',
        name: 'Error',
        stack: expect.any(String)
      });
    });
    test('fulfilled action', () => {
      const result = orderReducer(
        initialState,
        getOrders.fulfilled(mockOrder.orders, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.orders).toEqual(mockOrder.orders);
    });
    describe('async thunk actions getOrderByNumber', () => {
      test('pending action ', () => {
        const result = orderReducer(
          initialState,
          getOrderByNumber.pending('', 1)
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = orderReducer(
          initialState,
          getOrderByNumber.rejected(errorMessage, '', 1)
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = orderReducer(
          initialState,
          getOrderByNumber.fulfilled(mockOrderByNumber, '', 1)
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.order).toEqual(mockOrderByNumber.orders[0]);
      });
    });
  });
});
