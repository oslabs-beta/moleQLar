import React, { createContext, useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: "",
    user_id: null,
    loading: true, // Add loading state
  });

  useEffect(() => {
    async function verifyUser() {
      // check local storage
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthState((prev_state) => ({ ...prev_state, loading: false }));
        return;
      }

      if (!authState.loading && !authState.isAuth) {
        // navigate to login page -- handled in PrivateRoute Component
      }

      // verify user token
      let config = {
        headers: { authorization: `${token}` },
      };
      try {
        const response = await axios.post('/api/auth/protected', {}, config);
        if (response.status !== 200) {
          console.log('response.message:', response.message);
          console.log(
            'Unable to verify user. Reponse status: ',
            response.status
          );
          setAuthState({
            isAuth: false,
            username: "",
            user_id: null,
            loading: false, // Set loading to false when done
          });
          // return navigate('/login');
        } else {
          // successful login
          const data = response.data;
          localStorage.setItem("username", data.username);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("token", response.headers['authorization']);
          setAuthState({
            isAuth: true,
            username: data.username,
            user_id: data.user_id,
            loading: false, // Set loading to false when done
          });
        }
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error response data:', err.response.data);
          console.log('Error response status:', err.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', err.message);
        }
        // return navigate('/login');
      }
    }
    verifyUser();
  }, [authState.loading]);

  // const signup = async (formData) => {
  //   // send request to server to create new user
  //   try {
  //     const response = await axios.post('/api/auth/signup', formData);
  //     if (response.status !== 200) {
  //       console.log('Failed to sign up:', response);
  //       // TODO - front-end: refresh the page with 'invalid sign up credentials' error message
  //       return;
  //     }
  //     // success
  //     const data = response.data;
  //     console.log('data:', data);
  //     console.log('data.username:', data.username);
  //     if (data.username) {
  //       setAuthState({
  //         isAuth: true,
  //         username: data.username,
  //         user_id: data.user_id,
  //       })
  //       console.log('signup - setting username/token');
  //       localStorage.setItem("username", data.username);
  //       localStorage.setItem("user_id", data.user_id);
  //       localStorage.setItem("token", response.headers['authorization']);
  //       return; // success
  //     }
  //   } catch (err) {
  //     if (err.response) {
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       console.log(
  //         'Failed to sign up. Error response data:',
  //         err.response.data
  //       );
  //       console.log(
  //         'Failed to sign up. Error response status:',
  //         err.response.status
  //       );
  //     } else if (err.request) {
  //       // if request was made, but no response received
  //       console.log('Error request:', err.request);
  //     } else {
  //       // Something happened in setting up the request that triggered an error
  //       console.log('Error message:', err.message);
  //     }
  //   }
  // };

  // const login = async (username, password) => {
  //   // send request to server to login user
  //   try {
  //     const response = await axios.post('/api/auth/login', {
  //       username,
  //       password,
  //     });
  //     if (response.status !== 200) {
  //       console.log('Failed to login:', response);
  //       // TODO - front-end: refresh page with 'invalid credentials' error message
  //       return;
  //     }

  //     // success
  //     const data = response.data;
  //     if (data.username) {
  //       setAuthState({
  //         isAuth: true,
  //         username: data.username,
  //         user_id: data.user_id,
  //       });
  //       console.log('login - setting username/token');
  //       localStorage.setItem("username", data.username);
  //       localStorage.setItem("user_id", data.user_id);
  //       localStorage.setItem("token", response.headers['authorization']);
  //       // return navigate("/dashboard");
  //       return; // success
  //     }
  //   } catch (err) {
  //     if (err.response) {
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       console.log('Failed to login. Error response data:', err.response.data);
  //       console.log(
  //         'Failed to login. Error response status:',
  //         err.response.status
  //       );
  //     } else if (err.request) {
  //       // The request was made but no response was received
  //       console.log('Error request:', err.request);
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       console.log('Error message:', err.message);
  //     }
  //   }
  // };

  // const logout = () => {
  //   setAuthState({
  //     isAuth: false,
  //     username: "",
  //     user_id: null,
  //   });
  //   localStorage.removeItem("username");
  //   localStorage.removeItem("user_id");
  //   localStorage.removeItem("token");
  //   return navigate("/");
  // };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};