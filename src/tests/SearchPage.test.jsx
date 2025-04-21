import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '../views/SearchPage';
import * as dogModel from '../models/dogModel';
import * as authPresenter from '../presenters/authPresenter';
import * as searchPresenter from '../presenters/searchPresenter';

vi.mock('../models/dogModel');
vi.mock('../presenters/authPresenter');
vi.mock('../presenters/searchPresenter');

describe('SearchPage', () => {
  const mockBreeds = ['Labrador', 'Golden Retriever', 'Poodle', 'Bulldog'];
  const mockDogs = [
    { id: 'dog1', name: 'Max', breed: 'Labrador', age: 3, zip_code: '12345', img: 'dog1.jpg' },
    { id: 'dog2', name: 'Bella', breed: 'Poodle', age: 2, zip_code: '23456', img: 'dog2.jpg' },
  ];

  const mockLocation = { href: '' };
  Object.defineProperty(window, 'location', { writable: true, value: mockLocation });

  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  const sessionStorageMock = {
    setItem: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    dogModel.fetchBreeds.mockResolvedValue(mockBreeds);
    dogModel.searchDogs.mockResolvedValue({ resultIds: ['dog1', 'dog2'], total: 2 });
    dogModel.fetchDogDetails.mockResolvedValue(mockDogs);
    searchPresenter.manageFavorites.mockImplementation((favorites, dogId) => {
      return favorites.includes(dogId)
        ? favorites.filter(id => id !== dogId)
        : [...favorites, dogId];
    });
  });

  test('shows loading state initially', () => {
    dogModel.fetchBreeds.mockImplementation(() => new Promise(() => {}));
    render(<SearchPage />);
    expect(screen.getByText(/fetching available dogs/i)).toBeInTheDocument();
  });

  test('loads breeds and dogs on mount', async () => {
    render(<SearchPage />);
    await waitFor(() => {
      expect(dogModel.fetchBreeds).toHaveBeenCalled();
      expect(dogModel.searchDogs).toHaveBeenCalled();
      expect(dogModel.fetchDogDetails).toHaveBeenCalledWith(['dog1', 'dog2']);
    });
  });

  test('displays dog cards correctly', async () => {
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Bella')).toBeInTheDocument();
      expect(screen.getAllByText('Labrador')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Poodle')[0]).toBeInTheDocument();
    });
  });

  test('filters by breed correctly', async () => {
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Labrador' })).toBeInTheDocument();
    });
    const labradorButton = screen.getByRole('button', { name: 'Labrador' });
    fireEvent.click(labradorButton);
    await waitFor(() => {
      expect(dogModel.searchDogs).toHaveBeenCalledWith(expect.objectContaining({ breeds: ['Labrador'] }));
    });
  });

  test('toggles favorites correctly', async () => {
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /add to favorites/i })[0]).toBeInTheDocument();
    });
    const favoriteButton = screen.getAllByRole('button', { name: /add to favorites/i })[0];
    fireEvent.click(favoriteButton);
    expect(searchPresenter.manageFavorites).toHaveBeenCalledWith([], 'dog1');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('dogFavorites', JSON.stringify(['dog1']));
  });

  test('handles logout correctly', async () => {
    authPresenter.handleLogout = vi.fn();
    render(<SearchPage />);
    const logoutButton = await screen.findByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(authPresenter.handleLogout).toHaveBeenCalled();
  });

  test('generates match with favorites', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['dog1', 'dog2']));
    render(<SearchPage />);
    const generateMatchButton = await screen.findByText(/find my match/i);
    fireEvent.click(generateMatchButton);
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('matchFavorites', JSON.stringify(['dog1', 'dog2']));
    expect(window.location.href).toBe('/match');
  });

  test('displays error message on API failure', async () => {
    dogModel.fetchBreeds.mockRejectedValueOnce(new Error('API Error'));
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load dog breeds/i)).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    dogModel.searchDogs.mockResolvedValueOnce({ resultIds: ['dog1', 'dog2'], total: 25 });
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    expect(dogModel.searchDogs).toHaveBeenCalledWith(expect.objectContaining({ from: 12 }));
  });

  test('sorts dogs correctly', async () => {
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getByText(/breed a-z/i)).toBeInTheDocument();
    });
    const sortDescButton = screen.getByText(/breed z-a/i);
    fireEvent.click(sortDescButton);
    expect(dogModel.searchDogs).toHaveBeenCalledWith(expect.objectContaining({ sort: 'breed:desc' }));
  });

  test('handles empty search results', async () => {
    dogModel.searchDogs.mockResolvedValueOnce({ resultIds: [], total: 0 });
    render(<SearchPage />);
    await waitFor(() => {
      expect(screen.getAllByText(/no dogs found/i).length).toBeGreaterThan(0);
    });
  });
});