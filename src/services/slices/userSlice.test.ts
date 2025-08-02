import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import userReducer, {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser
} from './userSlice';
import { getUser, userState } from './userSlice';

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

const mockLocalStorage = {
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getItem: jest.fn(),
  key: jest.fn(),
  length: 0
} as unknown as Storage;

beforeEach(() => {
  mockLocalStorage.clear();
  deleteCookie('accessToken');
  global.localStorage = mockLocalStorage;
});

const mockUser = {
  success: true,
  user: { email: 'ivan@mail.ru', name: 'Иван' }
};

const mockUserLogin = {
  success: true,
  accessToken:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGEyMGZjZDVjYTMwMDAxY2ZmYzkzOCIsImlhdCI6MTc1NDA4ODIzMywiZXhwIjoxNzU0MDg5NDMzfQ.SR0QR46F_FYqzKGVV8uQ4FQ2Y31PFqrKPqKce4O-b5Y',
  refreshToken:
    '100f6bfe0bfae239049f45d414df26aab170c188be774bbcf7f3a7cb6202a25f9d0da78d7adce3e1',
  user: {
    email: 'ivan@mail.ru',
    name: 'Иван'
  }
};

const mockLogoutUser = { success: true, message: 'Successful logout' };

describe('user reducer tests', () => {
  let initialState: userState;
  beforeEach(() => {
    initialState = {
      isAuth: false,
      isLoading: false,
      error: null,
      user: null,
      isAuthChecked: false
    };
  });

  describe('async thunk actions getUser', () => {
    test('pending action ', () => {
      const result = userReducer(initialState, getUser.pending(''));
      expect(result.isLoading).toBe(true);
      expect(result.isAuth).toBe(false);
      expect(result.error).toBeNull();
    });
    test('rejected action', () => {
      const errorMessage = new Error('Network error');
      const result = userReducer(
        initialState,
        getUser.rejected(errorMessage, '')
      );
      expect(result.isLoading).toBe(false);
      expect(result.isAuth).toBe(false);
      expect(result.error).toEqual({
        message: 'Network error',
        name: 'Error',
        stack: expect.any(String)
      });
    });
    test('fulfilled action', () => {
      const result = userReducer(initialState, getUser.fulfilled(mockUser, ''));
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.isAuth).toBe(true);
      expect(result.user).toEqual(mockUser.user);
    });
    describe('async thunk actions loginUser', () => {
      test('pending action ', () => {
        const result = userReducer(
          initialState,
          loginUser.pending('', {
            email: 'ivan@mail.ru',
            password: '12345678'
          })
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = userReducer(
          initialState,
          loginUser.rejected(errorMessage, '', {
            email: 'ivan@mail.ru',
            password: '12345678'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = userReducer(
          initialState,
          loginUser.fulfilled(mockUserLogin, '', {
            email: 'ivan@mail.ru',
            password: '12345678'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.user).toEqual(mockUserLogin.user);
        expect(result.isAuth).toBe(true);
        expect(setCookie).toHaveBeenCalledWith(
          'accessToken',
          mockUserLogin.accessToken
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'refreshToken',
          mockUserLogin.refreshToken
        );
      });
    });
    describe('async thunk actions registerUser', () => {
      test('pending action ', () => {
        const result = userReducer(
          initialState,
          registerUser.pending('', {
            email: 'ivan@mail.ru',
            password: '12345678',
            name: 'Иван'
          })
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = userReducer(
          initialState,
          registerUser.rejected(errorMessage, '', {
            email: 'ivan@mail.ru',
            password: '12345678',
            name: 'Иван'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = userReducer(
          initialState,
          registerUser.fulfilled(mockUserLogin, '', {
            email: 'ivan@mail.ru',
            password: '12345678',
            name: 'Иван'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.user).toEqual(mockUserLogin.user);
        expect(setCookie).toHaveBeenCalledWith(
          'accessToken',
          mockUserLogin.accessToken
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'refreshToken',
          mockUserLogin.refreshToken
        );
      });
    });
    describe('async thunk actions forgotPassword', () => {
      test('pending action ', () => {
        const result = userReducer(
          initialState,
          forgotPassword.pending('', {
            email: 'ivan@mail.ru'
          })
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = userReducer(
          initialState,
          forgotPassword.rejected(errorMessage, '', {
            email: 'ivan@mail.ru'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = userReducer(
          initialState,
          forgotPassword.fulfilled(mockUserLogin, '', {
            email: 'ivan@mail.ru'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });
    });
    describe('async thunk actions resetPassword', () => {
      test('pending action ', () => {
        const result = userReducer(
          initialState,
          resetPassword.pending('', {
            password: '12345678',
            token: '12345'
          })
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = userReducer(
          initialState,
          resetPassword.rejected(errorMessage, '', {
            password: '12345678',
            token: '12345'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = userReducer(
          initialState,
          resetPassword.fulfilled(mockUserLogin, '', {
            password: '12345678',
            token: '12345'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });
    });
    describe('async thunk actions updateUser', () => {
      test('pending action ', () => {
        const result = userReducer(
          initialState,
          updateUser.pending('', {
            password: '12345678'
          })
        );
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = userReducer(
          initialState,
          updateUser.rejected(errorMessage, '', {
            password: '12345678'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = userReducer(
          initialState,
          updateUser.fulfilled(mockUserLogin, '', {
            password: '12345678'
          })
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.user).toEqual(mockUserLogin.user);
        expect(result.isAuth).toBe(true);
      });
    });
    describe('async thunk actions logoutUser', () => {
      test('pending action ', () => {
        const result = userReducer(initialState, logoutUser.pending(''));
        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
      test('rejected action', () => {
        const errorMessage = new Error('Network error');
        const result = userReducer(
          initialState,
          logoutUser.rejected(errorMessage, '')
        );
        expect(result.isLoading).toBe(false);
        expect(result.error).toEqual({
          message: 'Network error',
          name: 'Error',
          stack: expect.any(String)
        });
      });
      test('fulfilled action', () => {
        const result = userReducer(
          initialState,
          logoutUser.fulfilled(mockLogoutUser, '')
        );
        deleteCookie('accessToken');
        mockLocalStorage.removeItem('refreshToken');
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.user).toBeNull();
        expect(result.isAuth).toBe(false);
        expect(getCookie('accessToken')).toBeUndefined();
        expect(mockLocalStorage.getItem('refreshToken')).toBeUndefined();
      });
    });
  });
});
