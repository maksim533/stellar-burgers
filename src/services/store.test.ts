import store, { rootReducer } from './store';
import { expect, test, describe } from '@jest/globals';

describe('rootReducer', () => {
  test('Проверка на коректность rootReducer', () => {
    // Создаем неизвестный экшен
    const unknownAction = {
      type: 'UNKNOWN_ACTION'
    };

    // Вызываем rootReducer с undefined состоянием
    const result = rootReducer(undefined, unknownAction);

    // Проверяем результат
    expect(result).toEqual(store.getState());
  });
});
