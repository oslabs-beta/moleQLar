import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: '',
    user_id: null,
    loading: true,
  });

  useEffect(() => {
    async function verifyUser() {
      try {
        const response = await axios.get('/api/auth/status');
        if (response.status === 200 && response.data.isAuth) {
          setAuthState({
            isAuth: true,
            username: response.data.username,
            user_id: response.data.user_id,
            loading: false,
          });
        } else {
          setAuthState({
            isAuth: false,
            username: '',
            user_id: null,
            loading: false,
          });
        }
      } catch (err) {
        console.error('Error fetching user status:', err);
        setAuthState({
          isAuth: false,
          username: '',
          user_id: null,
          loading: false,
        });
      }
    }
    verifyUser();
  }, [navigate]);

  const signup = async (formData) => {
    try {
      const response = await axios.post('/api/auth/signup', formData);
      if (response.status === 200) {
        setAuthState({
          isAuth: true,
          username: response.data.username,
          user_id: response.data.user_id,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error during signup:', err);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      if (response.status === 200) {
        setAuthState({
          isAuth: true,
          username: response.data.username,
          user_id: response.data.user_id,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const logout = () => {
    axios
      .post('/api/auth/logout')
      .then(() => {
        setAuthState({
          isAuth: false,
          username: '',
          user_id: null,
        });
        navigate('/');
      })
      .catch((err) => {
        console.error('Error during logout:', err);
      });
  };

  return (
    <AuthContext.Provider value={{ ...authState, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
