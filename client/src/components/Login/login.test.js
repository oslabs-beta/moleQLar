// Import necessary modules and functions
import React from 'react'; // Import React library
import { render, screen, waitFor } from '@testing-library/react'; // Import testing functions from React Testing Library
import '@testing-library/jest-dom'; // Extend Jest matchers with custom matchers for DOM nodes
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import Login from './Login'; // Import the Login component
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import MUI's theme creation and ThemeProvider
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mocking the login function and AuthContextProvider
const loginMock = jest.fn(); // Create a mock function for login
const mockLogin = jest.fn();
const mockNavigate = jest.fn();

// Jest Mock setup
jest.mock('../../contexts/AuthContext');
const mockUseAuth = useAuth;
mockUseAuth.mockReturnValue({
  authState: { isAuth: false },
  setAuthState: jest.fn(),
});

//
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));

// "renderLoginComponent" for Login Component Rendering
function renderLoginComponent() {
  return render(
    <AuthContext.Provider value={{ isAuth: true, login: mockLogin }}>
      <Router>
        <Login />
      </Router>
    </AuthContext.Provider>
  );
}

// Mocking AuthContextProvider
const AuthContextProviderMock = (
  { children } // Create a mock AuthContext provider
) => (
  <AuthContext.Provider value={{ login: loginMock }}>
    {children}
  </AuthContext.Provider>
);

// Creating a custom theme for the component
const theme = createTheme({
  // Create a custom MUI theme
  palette: {
    primary: {
      main: '#9c27b0',
    },
  },
});

// Describe the test suite for the Login component
describe('Login Component', () => {
  beforeEach(() => {
    fetch.resetMocks(); // Reset any mocked fetch calls before each test
  });

  // Test case: Rendering the Login component correctly
  test('renders Login component correctly', () => {
    render(
      // Render the Login component within ThemeProvider and AuthContextProviderMock
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthContextProviderMock>
            <Login />
          </AuthContextProviderMock>
        </ThemeProvider>
      </MemoryRouter>
    );

    // Check if username, password fields, and login button are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument(); // Verify username input is in the document
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument(); // Verify password input is in the document
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument(); // Verify login button is in the document
  });

  // // Navigate Test -> to '/dashboard' after successful login
  // test('navigates to dashboard after successful login', async () => {
  //   mockLogin.mockImplementation(() => Promise.resolve());
  //   renderLoginComponent();
  //   userEvent.click(screen.getByRole('button', { name: /login!/i }));

  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  //   });
  // });
});
