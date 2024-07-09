import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./contexts/AuthContext.js";

import MainPage from "./components/Main/Main.jsx";
import Signup from "./components/Signup/Signup.jsx";
import Login from "./components/Login/Login.jsx";
import Team from './components/Team/Team.jsx';
import About from './components/About/About.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';


// A wrapper for <Route> that redirects to the login page if the user is not authenticated.
const PrivateRoutes = () => {
    const { isAuth } = useAuth();
    console.log('PrivateRoutes - isAuth:', isAuth);
    if (!isAuth) {
        return <Navigate to="/login" />;
    }
    // if logged in
    return <Outlet />;
};

const App = () =>{
    return(
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/team" element={<Team />} />   
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    {/* private routes */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Add more private routes here */}
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App;