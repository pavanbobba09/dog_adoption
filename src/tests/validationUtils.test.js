import { describe, test, expect, vi } from 'vitest';
import {
  isValidEmail,
  isValidName,
  sanitizeInput,
  debounce,
} from '../utils/validationUtils';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+label@subdomain.example.com',
        'user_name@domain.com',
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    test('should invalidate incorrect email formats', () => {
      const invalidEmails = [
        'test@',
        '@domain.com',
        'test.domain.com',
        'test@domain',
        'test@.com',
        '',
        null,
        undefined,
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidName', () => {
    test('should validate names with minimum length', () => {
      expect(isValidName('John')).toBe(true);
      expect(isValidName('Jo')).toBe(true);
      expect(isValidName('A', 1)).toBe(true);
    });

    test('should invalidate names below minimum length', () => {
      expect(isValidName('J')).toBe(false);
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
      expect(isValidName(null)).toBe(false);
      expect(isValidName(undefined)).toBe(false);
    });

    test('should respect custom minimum length', () => {
      expect(isValidName('John', 5)).toBe(false);
      expect(isValidName('Alexander', 5)).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    test('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("hack")</script>')).toBe('scriptalert("hack")/script');
      expect(sanitizeInput('<p>Hello</p>')).toBe('pHello/p');
    });

    test('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
      expect(sanitizeInput('\n\ttext\n\t')).toBe('text');
    });

    test('should handle invalid inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('should call function after wait time', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(299);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should only call function once if called multiple times within wait period', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should pass arguments to debounced function', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('arg1', 'arg2');

      vi.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });
});