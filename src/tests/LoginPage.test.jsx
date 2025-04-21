import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import LoginPage from '../views/LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<LoginPage />);
  });
});
