import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: "",
  });

  useEffect(() => {
    async function verifyUser() {
      console.log('verifyUser');
      // check local storage
      const storedUsername = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      // verify user token
      let config = {
        headers: { 'authorization': `${token}` }
      }
      try {
        const response = await axios.post('/api/auth/protected', {}, config)
        if (response.status !== 200) {
          console.log('response.message:', response.message);
          console.log('Unable to verify user. Reponse status: ', response.status);
          setAuthState({
            isAuth: false,
            username: "",
          });
          // return;
          return navigate('/login');
        } else {
          // successful login 
          const data = response.data;
          localStorage.setItem("username", data.username);
          localStorage.setItem("token", response.headers['authorization']);
          setAuthState({
            isAuth: true,
            username: data.username,
          });
          console.log('SUCCESS');
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
        return navigate('/login');
      }
    }
    verifyUser();
    navigate('/dashboard');
  }, []);

  const login = async (username, password) => {
    console.log('login');
    // send request to server to login user
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.status !== 200) {
        console.log('Failed to login, status:', response.status);
        // TODO - refresh page with invalid credentials error message
        return;
      }
      const data = response.data;
      // if successful
      if (data.username) {
        setAuthState({
          isAuth: true,
          username: data.username,
          token: data.token,
        });
        console.log('setting username/token');
        localStorage.setItem("username", data.username);
        localStorage.setItem("token", response.headers['authorization']);
        return navigate("/dashboard");
      }
    } catch (err) {
      if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Failed to login. Error response data:', err.response.data);
          console.log('Failed to login. Error response status:', err.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', err.message);
        }
    }
    
  };

  const logout = () => {
    setAuthState({
      isAuth: false,
      username: "",
      userId: "",
    });
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    return navigate("/");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}