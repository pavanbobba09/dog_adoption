import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as authPresenter from '../presenters/authPresenter';

// Mock the authentication presenter module
vi.mock('../presenters/authPresenter');

// Mock route components inside App if necessary to prevent double routers
vi.mock('../views/LoginPage', () => () => <div>Login Page</div>);
vi.mock('../views/SearchPage', () => () => <div>Search Page</div>);
vi.mock('../views/MatchPage', () => () => <div>Match Page</div>);


describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login page at root path', async () => {
    authPresenter.checkExistingSession.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  test('redirects to login if not authenticated', async () => {
    authPresenter.checkExistingSession.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  test('allows access to search page when authenticated', async () => {
    authPresenter.checkExistingSession.mockResolvedValue(true);

    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Search Page')).toBeInTheDocument();
  });

  test('redirects unknown routes to root', async () => {
    authPresenter.checkExistingSession.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  test('handles authentication error gracefully', async () => {
    authPresenter.checkExistingSession.mockRejectedValue(new Error('Auth error'));

    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  test('allows access to match page when authenticated', async () => {
    authPresenter.checkExistingSession.mockResolvedValue(true);

    render(
      <MemoryRouter initialEntries={['/match']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Match Page')).toBeInTheDocument();
  });

  test('shows loading state while checking authentication', async () => {
    authPresenter.checkExistingSession.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(true), 100))
    );

    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Search Page')).toBeInTheDocument();
    });
  });
});
