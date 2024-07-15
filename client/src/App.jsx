import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Main from "./components/Main/Main";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Team from './components/Team/Team';
import About from './components/About/About';
import Dashboard from './components/Dashboard/Dashboard';
import Graph from './components/Graph/Graph';
import { GraphProvider } from './contexts/GraphContext';

// A wrapper for <Route> that redirects to the login page if the user is not authenticated.
const PrivateRoutes = () => {
    const { authState, setAuthState } = useAuth();
    
    if (authState.loading) {
        // Can return a loading spinner component or any loading UI here
        console.log('Loading...');
        return <div>Loading...</div>;
    }
    console.log('PrivateRoutes - isAuth:', authState.isAuth);
    if (!authState.isAuth) {
        return <Navigate to="/login" />;
    }
    // if logged im
    return (
        <GraphProvider>
            <Outlet />
        </GraphProvider>
    )
};
 const App = () =>{
    return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    {/* private routes */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/graph/:userId/:graphId" element={<Graph />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Add more private routes here */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;