// src/__tests__/models/authModel.test.js
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { loginUser, logoutUser, checkSession } from '../../models/authModel';

// ... rest of the test file

// src/__tests__/presenters/authPresenter.test.js
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { handleLogin, checkExistingSession, handleLogout } from '../../presenters/authPresenter';
import * as authModel from '../../models/authModel';

// ... rest of the test file

// src/__tests__/views/LoginPage.test.jsx
import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../views/LoginPage';
import * as authPresenter from '../../presenters/authPresenter';

// ... rest of the test file