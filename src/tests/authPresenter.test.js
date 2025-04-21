import { describe, test, expect, beforeEach, vi } from 'vitest';
import { handleLogin, checkExistingSession, handleLogout } from '../presenters/authPresenter';
import * as authModel from '../models/authModel';

// Mock the auth model
vi.mock('../models/authModel');

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.getElementById
document.getElementById = vi.fn();

describe('Auth Presenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = '';
  });

  describe('handleLogin', () => {
    test('should handle successful login', async () => {
      const mockResponse = { ok: true };
      authModel.loginUser.mockResolvedValueOnce(mockResponse);
      document.getElementById.mockReturnValue({ checked: false });

      const result = await handleLogin('John Doe', 'john@example.com');

      expect(result.success).toBe(true);
      expect(window.location.href).toBe('/search');
    });

    test('should handle login with remember me checked', async () => {
      const mockResponse = { ok: true };
      authModel.loginUser.mockResolvedValueOnce(mockResponse);
      document.getElementById.mockReturnValue({ checked: true });

      await handleLogin('John Doe', 'john@example.com');

      expect(localStorage.setItem).toHaveBeenCalledWith('rememberedEmail', 'john@example.com');
    });

    test('should handle 400 error', async () => {
      const mockResponse = { ok: false, status: 400 };
      authModel.loginUser.mockResolvedValueOnce(mockResponse);

      const result = await handleLogin('John Doe', 'invalid-email');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email or name format. Please check your details.');
    });

    test('should handle 401 error', async () => {
      const mockResponse = { ok: false, status: 401 };
      authModel.loginUser.mockResolvedValueOnce(mockResponse);

      const result = await handleLogin('John Doe', 'john@example.com');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Authentication failed. Please check your credentials.');
    });

    test('should handle network error', async () => {
      authModel.loginUser.mockRejectedValueOnce(new Error('Network error'));

      const result = await handleLogin('John Doe', 'john@example.com');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network error. Please check your connection and try again.');
    });
  });

  describe('checkExistingSession', () => {
    test('should return true for valid session', async () => {
      authModel.checkSession.mockResolvedValueOnce(true);

      const result = await checkExistingSession();

      expect(result).toBe(true);
    });

    test('should return false for invalid session', async () => {
      authModel.checkSession.mockResolvedValueOnce(false);

      const result = await checkExistingSession();

      expect(result).toBe(false);
    });

    test('should handle errors gracefully', async () => {
      authModel.checkSession.mockRejectedValueOnce(new Error('Session check failed'));

      const result = await checkExistingSession();

      expect(result).toBe(false);
    });
  });

  describe('handleLogout', () => {
    test('should successfully logout and redirect', async () => {
      authModel.logoutUser.mockResolvedValueOnce();

      await handleLogout();

      expect(authModel.logoutUser).toHaveBeenCalled();
      expect(window.location.href).toBe('/');
    });

    test('should show alert on logout failure', async () => {
      authModel.logoutUser.mockRejectedValueOnce(new Error('Logout failed'));
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await handleLogout();

      expect(alertMock).toHaveBeenCalledWith('Logout failed. Please try again.');
      alertMock.mockRestore();
    });
  });
});