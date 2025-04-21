import { describe, test, expect, beforeEach, vi } from 'vitest';
import { loginUser, logoutUser, checkSession } from '../models/authModel';

// Mock fetch globally
global.fetch = vi.fn();

describe('Auth Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('loginUser', () => {
    test('should successfully login with valid credentials', async () => {
      const mockResponse = { ok: true };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const response = await loginUser('John Doe', 'john@example.com');

      expect(fetch).toHaveBeenCalledWith(
        'https://frontend-take-home-service.fetch.com/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }),
        }
      );
      expect(response).toBe(mockResponse);
    });

    test('should handle login failure', async () => {
      const mockResponse = { ok: false, status: 400 };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const response = await loginUser('', '');
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('logoutUser', () => {
    test('should successfully logout', async () => {
      const mockResponse = { ok: true };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const response = await logoutUser();

      expect(fetch).toHaveBeenCalledWith(
        'https://frontend-take-home-service.fetch.com/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      expect(response).toBe(mockResponse);
    });
  });

  describe('checkSession', () => {
    test('should return true for valid session', async () => {
      const mockResponse = { ok: true };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const isValid = await checkSession();

      expect(fetch).toHaveBeenCalledWith(
        'https://frontend-take-home-service.fetch.com/dogs/breeds',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      expect(isValid).toBe(true);
    });

    test('should return false for invalid session', async () => {
      const mockResponse = { ok: false };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const isValid = await checkSession();
      
      expect(isValid).toBe(false);
    });

    test('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const isValid = await checkSession();
      
      expect(isValid).toBe(false);
    });
  });
});