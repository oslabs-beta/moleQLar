import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    username: "",
    userId: "",
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setAuthState({
        isAuth: true,
        username: storedUsername,
        userId: storedUserId,
      });
    }
  }, []);

  const login = (username, userId) => {
    setAuthState({
      isAuth: true,
      username: username,
      userId: userId,
    });
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    navigate("/dashboard");
  };

  const logout = () => {
    setAuthState({
      isAuth: false,
      username: "",
      userId: "",
    });
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
