import { describe, test, expect, beforeEach, vi } from 'vitest';
import { fetchBreeds, searchDogs, fetchDogDetails, generateMatch } from '../models/dogModel';

global.fetch = vi.fn();

describe('Dog Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBreeds', () => {
    test('should successfully fetch breeds', async () => {
      const mockBreeds = ['Labrador', 'Golden Retriever', 'Poodle'];
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockBreeds),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const breeds = await fetchBreeds();

      expect(fetch).toHaveBeenCalledWith(
        'https://frontend-take-home-service.fetch.com/dogs/breeds',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      expect(breeds).toEqual(mockBreeds);
    });

    test('should throw error on failed fetch', async () => {
      const mockResponse = { ok: false, status: 401 };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await expect(fetchBreeds()).rejects.toThrow('Failed to fetch breeds: 401');
    });
  });

  describe('searchDogs', () => {
    test('should search dogs with valid parameters', async () => {
      const searchParams = {
        breeds: ['Labrador', 'Poodle'],
        sort: 'breed:asc',
        size: 20,
        from: 0,
      };
      const mockResults = {
        resultIds: ['dog1', 'dog2', 'dog3'],
        total: 3,
        next: '/dogs/search?from=3',
      };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockResults),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const results = await searchDogs(searchParams);

      expect(results).toEqual(mockResults);
      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('breeds=Labrador');
      expect(calledUrl).toContain('breeds=Poodle');
      expect(calledUrl).toMatch(/sort=breed%3Aasc/);
      expect(calledUrl).toContain('size=20');
      expect(calledUrl).toContain('from=0');
    });

    test('should handle empty search parameters', async () => {
      const searchParams = {};
      const mockResults = {
        resultIds: ['dog1', 'dog2'],
        total: 2,
      };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockResults),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const results = await searchDogs(searchParams);

      expect(results).toEqual(mockResults);
    });
  });

  describe('fetchDogDetails', () => {
    test('should fetch dog details successfully', async () => {
      const dogIds = ['dog1', 'dog2'];
      const mockDogs = [
        { id: 'dog1', name: 'Max', breed: 'Labrador' },
        { id: 'dog2', name: 'Bella', breed: 'Poodle' },
      ];
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockDogs),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const dogs = await fetchDogDetails(dogIds);

      expect(fetch).toHaveBeenCalledWith(
        'https://frontend-take-home-service.fetch.com/dogs',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(dogIds),
        })
      );
      expect(dogs).toEqual(mockDogs);
    });

    test('should return empty array for empty dog IDs', async () => {
      const dogs = await fetchDogDetails([]);
      expect(dogs).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('generateMatch', () => {
    test('should generate match successfully', async () => {
      const favoriteIds = ['dog1', 'dog2', 'dog3'];
      const mockMatch = { match: 'dog2' };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockMatch),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const match = await generateMatch(favoriteIds);

      expect(fetch).toHaveBeenCalledWith(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(favoriteIds),
        })
      );
      expect(match).toEqual(mockMatch);
    });

    test('should throw error when no favorites selected', async () => {
      await expect(generateMatch([])).rejects.toThrow('No favorite dogs selected for matching');
    });
  });
});