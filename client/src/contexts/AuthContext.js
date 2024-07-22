import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: '',
    userId: null,
    loading: true
  });

  useEffect(() => {
    async function verifyUser() {
      try {
        const response = await axios.get('/api/auth/status');
        if (response.data.isAuth) {
          setAuthState({
            isAuth: true,
            username: response.data.username,
            userId: response.data.user_id,
            loading: false
          });
        } else {
          setAuthState({
            isAuth: false,
            username: '',
            userId: null,
            loading: false
          });
        }
      } catch (err) {
        console.error('Error fetching user status:', err);
        setAuthState({
          isAuth: false,
          username: '',
          userId: null,
          loading: false
        });
      }
    }
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);