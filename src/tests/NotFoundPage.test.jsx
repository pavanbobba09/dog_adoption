import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from '../views/NotFoundPage';

// Wrap component in BrowserRouter for Link component
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('NotFoundPage', () => {
  test('renders 404 message', () => {
    renderWithRouter(<NotFoundPage />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/oops! it looks like this puppy ran away/i)).toBeInTheDocument();
  });

  test('displays home button', () => {
    renderWithRouter(<NotFoundPage />);
    
    const homeButton = screen.getByRole('link', { name: /go back home/i });
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.getAttribute('href')).toBe('/');
  });

  test('renders paw print emoji', () => {
    renderWithRouter(<NotFoundPage />);
    
    expect(screen.getByText('🐾')).toBeInTheDocument();
  });
});