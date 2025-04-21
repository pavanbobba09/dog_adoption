import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  manageFavorites,
  processSearchParams,
  handleGenerateMatch,
  calculatePagination,
} from '../presenters/searchPresenter';
import * as dogModel from '../models/dogModel';

// Mock the dog model
vi.mock('../models/dogModel');

describe('Search Presenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('manageFavorites', () => {
    test('should add dog to favorites if not present', () => {
      const currentFavorites = ['dog1', 'dog2'];
      const result = manageFavorites(currentFavorites, 'dog3');
      
      expect(result).toEqual(['dog1', 'dog2', 'dog3']);
    });

    test('should remove dog from favorites if already present', () => {
      const currentFavorites = ['dog1', 'dog2', 'dog3'];
      const result = manageFavorites(currentFavorites, 'dog2');
      
      expect(result).toEqual(['dog1', 'dog3']);
    });
  });

  describe('processSearchParams', () => {
    test('should remove empty breeds array', () => {
      const params = { breeds: [], sort: 'breed:desc' };
      const result = processSearchParams(params);
      
      expect(result.breeds).toBeUndefined();
      expect(result.sort).toBe('breed:desc');
    });

    test('should add default sort if not provided', () => {
      const params = { breeds: ['Labrador'] };
      const result = processSearchParams(params);
      
      expect(result.sort).toBe('breed:asc');
    });

    test('should preserve existing sort and non-empty breeds', () => {
      const params = { breeds: ['Labrador', 'Poodle'], sort: 'breed:desc' };
      const result = processSearchParams(params);
      
      expect(result.breeds).toEqual(['Labrador', 'Poodle']);
      expect(result.sort).toBe('breed:desc');
    });
  });

  describe('handleGenerateMatch', () => {
    test('should handle successful match generation', async () => {
      const favoriteIds = ['dog1', 'dog2', 'dog3'];
      const mockMatch = { match: 'dog2' };
      dogModel.generateMatch.mockResolvedValueOnce(mockMatch);

      const result = await handleGenerateMatch(favoriteIds);

      expect(result.success).toBe(true);
      expect(result.matchId).toBe('dog2');
    });

    test('should handle empty favorites array', async () => {
      const result = await handleGenerateMatch([]);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please select at least one favorite dog to generate a match.');
    });

    test('should handle match generation failure', async () => {
      const favoriteIds = ['dog1', 'dog2'];
      dogModel.generateMatch.mockResolvedValueOnce(null);

      const result = await handleGenerateMatch(favoriteIds);

      expect(result.success).toBe(false);
      expect(result.message).toBe('No match was found. Please try again with different dogs.');
    });

    test('should handle error during match generation', async () => {
      const favoriteIds = ['dog1', 'dog2'];
      dogModel.generateMatch.mockRejectedValueOnce(new Error('API error'));

      const result = await handleGenerateMatch(favoriteIds);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to generate a match. Please try again.');
    });
  });

  describe('calculatePagination', () => {
    test('should calculate pagination for first page', () => {
      const result = calculatePagination(1, 100, 10);

      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(10);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.visiblePages).toEqual([1, 2, 3, 4, 5]);
      expect(result.startItem).toBe(1);
      expect(result.endItem).toBe(10);
    });

    test('should calculate pagination for middle page', () => {
      const result = calculatePagination(5, 100, 10);

      expect(result.currentPage).toBe(5);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
      expect(result.visiblePages).toEqual([3, 4, 5, 6, 7]);
      expect(result.startItem).toBe(41);
      expect(result.endItem).toBe(50);
    });

    test('should calculate pagination for last page', () => {
      const result = calculatePagination(10, 100, 10);

      expect(result.currentPage).toBe(10);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
      expect(result.visiblePages).toEqual([6, 7, 8, 9, 10]);
      expect(result.startItem).toBe(91);
      expect(result.endItem).toBe(100);
    });

    test('should handle partial last page', () => {
      const result = calculatePagination(6, 55, 10);

      expect(result.currentPage).toBe(6);
      expect(result.totalPages).toBe(6);
      expect(result.hasNextPage).toBe(false);
      expect(result.visiblePages).toEqual([2, 3, 4, 5, 6]);
      expect(result.startItem).toBe(51);
      expect(result.endItem).toBe(55);
    });
  });
});