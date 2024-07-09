import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../src/components/Login/Login';
import { AuthContext } from '../src/contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function renderLoginComponent() {
  return render(
    <AuthContext.Provider value={{ isAuth: false, login: mockLogin }}>
      <Router>
        <Login />
      </Router>
    </AuthContext.Provider>
  );
}

describe('Login Component Tests', () => {
  test('component renders', () => {
    renderLoginComponent();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test('handles form submission with correct credentials', async () => {
    renderLoginComponent();
    userEvent.type(screen.getByLabelText("Username"), 'testuser');
    userEvent.type(screen.getByLabelText("Password"), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login!/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  test('navigates to dashboard after successful login', async () => {
    mockLogin.mockImplementation(() => Promise.resolve());
    renderLoginComponent();
    userEvent.click(screen.getByRole('button', { name: /login!/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
