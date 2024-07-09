// Import necessary modules and functions
import React from 'react'; // Import React library
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'; // Import testing functions from React Testing Library
import '@testing-library/jest-dom'; // Extend Jest matchers with custom matchers for DOM nodes
import { AuthContext } from '../src/contexts/AuthContext'; // Import AuthContext
import Login from '../src/components/Login/Login'; // Import the Login component
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import MUI's theme creation and ThemeProvider
import { MemoryRouter } from 'react-router-dom';

// Mocking the login function and AuthContextProvider
const loginMock = jest.fn(); // Create a mock function for login
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

//   // Test case: Handling successful login
//   test('handles successful login', async () => {
//     fetch.mockResponseOnce(
//       // Mock a successful login response
//       JSON.stringify({
//         success: true,
//         data: { userId: '1', username: 'testuser' },
//       })
//     );

//     const loginMock = jest.fn();
//     const authValue = {
//       isAuth: false,
//       login: loginMock
//     }

//     render(
//       // Render the Login component within ThemeProvider and AuthContextProviderMock
//       <MemoryRouter>
//         <ThemeProvider theme={theme}>
//           <AuthContextProviderMock>
//             <Login />
//           </AuthContextProviderMock>
//         </ThemeProvider>
//       </MemoryRouter>
//     );

//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve({ userId: '1', username: 'testuser' }),
//       })
//   );
//     // Simulate user input for username and password
//     fireEvent.change(screen.getByLabelText(/username/i), {
//       target: { value: 'testuser' },
//     }); // Simulate entering username
//     fireEvent.change(screen.getByLabelText(/password/i), {
//       target: { value: 'password' },
//     }); // Simulate entering password

//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /login/i }));
//     })

    
//     // await AuthContext({ username: 'testuser', password: 'password' }, loginMock);

//     // await waitFor(() => {
//     //     expect(fetch).toHaveBeenCalledWith('http://localhost:3000/login', expect.any(Object));
//     //     // expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
//     //   });

//     // Add assertions to verify the login behavior
//     expect(fetch).toHaveBeenCalledWith('http://localhost:3000/login', expect.any(Object)); // Update with actual API endpoint
//     expect(loginMock).toHaveBeenCalledWith({ userId: '1', username: 'testuser' });

  
// //      // Wait for the "Logout" button to appear
// //   await waitFor(() => {
// //     expect(loginMock).toHaveBeenCalledWith('1', 'testuser');
// //     // expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
// //   });

//     // const logout = screen.getByText('Logout');
//     // expect(logout).toBeInTheDocument();

    
//     // Checks for link "logout"
//     // await waitFor(async () => {
//     //   const SQLtest = screen.findByText('Click or drag to add SQL files');
//     //   //expect(SQLtest).toBe('button');
//     //   console.log(SQLtest);
//     //   expect(loginMock).toHaveBeenCalledWith(SQLtest);
//     // })
//     // Verify the mock login function was called with correct arguments

//     // Wait for success message or redirection to occur
//     // await screen.findByText(/login successful/i); // Wait for a success message to appear

//     // Check if the login function is called with correct arguments
//     // expect(loginMock).toHaveBeenCalledWith('testuser', '1'); // Verify the mock login function was called with correct arguments
//   });

// //   // Test case: Handling failed login
// //   test('handles failed login', async () => {
// //     fetch.mockResponseOnce(JSON.stringify({ success: false }), { status: 401 }); // Mock a failed login response

// //     render(
// //       // Render the Login component within ThemeProvider and AuthContextProviderMock
// //       <ThemeProvider theme={theme}>
// //         <AuthContextProviderMock>
// //           <Login />
// //         </AuthContextProviderMock>
// //       </ThemeProvider>
// //     );

// //     // Simulate user input for username and password
// //     fireEvent.change(screen.getByLabelText(/username/i), {
// //       target: { value: 'wronguser' },
// //     }); // Simulate entering wrong username
// //     fireEvent.change(screen.getByLabelText(/password/i), {
// //       target: { value: 'wrongpassword' },
// //     }); // Simulate entering wrong password

// //     // Simulate clicking the login button
// //     fireEvent.click(screen.getByRole('button', { name: /login/i })); // Simulate clicking the login button

// //     // Wait for error message to be displayed
// //     await screen.findByText(/failed to login/i); // Wait for an error message to appear

// //     // Check that the login function is not called
// //     expect(loginMock).not.toHaveBeenCalled(); // Verify the mock login function was not called
// //   });
});
