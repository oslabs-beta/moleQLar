import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// import ProvideAuth from "./components/ProvideAuth/ProvideAuth";
import MainPage from "./components/MainPage/MainPage.jsx";
import Navbar from './components/Navbar/NavBar.jsx';
import Signup from "./components/Signup/Signup.jsx";
import Login from "./components/Login/Login";
import Team from './components/TeamPage/TeamPage.jsx';
import About from './components/About/About.jsx';
import UploadSqlSChemaPage from "./components/UploadSqlSchema/UploadSqlSChemaPage.jsx";
import { AuthProvider } from "./contexts/AuthContext.js";

import './assets/styles/globalStyles.scss';

// A wrapper for <Route> that redirects to the login page if the user is not authenticated.
// const PrivateRoute = ({ children }) => {
//     let auth = useAuth();
//     return auth.user ? children : <Navigate to="/login" />;
// };

const App = () =>{
    return(
        <BrowserRouter>
            <AuthProvider>
                {/* <Navbar />  */}
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/team" element={<Team />} />   
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/dashboard" element={<UploadSqlSChemaPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App;