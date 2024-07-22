import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { ThemeProvider } from './contexts/ThemeContext.js';
import './index.scss';

import Main from './components/Main/Main';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Team from './components/Team/Team';
import About from './components/About/About';
import Dashboard from './components/Dashboard/Dashboard';
import Graph from './components/Graph/Graph';
import { GraphProvider } from './contexts/GraphContext';

const PrivateRoutes = () => {
  const { authState } = useAuth();

  if (authState.loading) {
    return <div>Loading...</div>;
  }
  if (!authState.isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <GraphProvider>
      <Outlet />
    </GraphProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/team" element={<Team />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/graph/:userId/:graphId" element={<Graph />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
