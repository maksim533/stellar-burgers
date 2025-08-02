import { feedsApi, initialState } from './feedSlice';
import feedReducer from './feedSlice';

const mockOrders = {
  success: true,
  orders: [
    {
      _id: '688d07eed5ca30001cffd02a',
      ingredients: [
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0948',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Альфа-сахаридный флюоресцентный spicy био-марсианский бургер',
      createdAt: '2025-08-01T18:31:10.437Z',
      updatedAt: '2025-08-01T18:31:11.380Z',
      number: 85600
    },
    {
      _id: '688cddffd5ca30001cffcfc0',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0941'
      ],
      status: 'done',
      name: 'Краторный био-марсианский люминесцентный бургер',
      createdAt: '2025-08-01T15:32:15.218Z',
      updatedAt: '2025-08-01T15:32:16.048Z',
      number: 85591
    }
  ],
  total: 85228,
  totalToday: 94
};

describe('feedSlice reducer tests', () => {
  beforeEach(() => {
    initialState;
  });

  describe('async thunk actions', () => {
    test('pending action', () => {
      const result = feedReducer(initialState, feedsApi.pending(''));
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    test('rejected action', () => {
      const errorMessage = new Error('Network error');
      const result = feedReducer(
        initialState,
        feedsApi.rejected(errorMessage, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual({
        message: 'Network error',
        name: 'Error',
        stack: expect.any(String)
      });
    });

    test('fulfilled action', () => {
      const result = feedReducer(
        initialState,
        feedsApi.fulfilled(mockOrders, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.orderData.orders).toEqual(mockOrders.orders);
      expect(result.orderData.total).toBe(85228);
      expect(result.orderData.totalToday).toBe(94);
    });
  });
});
