import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProvideAuth from "./components/ProvideAuth/ProvideAuth";
import MainPage from "./components/MainPage/MainPage.jsx";
import Navbar from './components/NavBar.jsx';
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";

// A wrapper for <Route> that redirects to the login page if the user is not authenticated.
const PrivateRoute = ({ children }) => {
    let auth = useAuth();
    return auth.user ? children : <Navigate to="/login" />;
};

const App = () =>{
    return(
        <ProvideAuth>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </ProvideAuth>
    )
}

export default App;





// import React from "react";

// import './components/Styles/styles.css'
// const App = () =>{
//     return(
//         <div className="App">
//        <Navbar/>
//        <MainPage/>
//         </div>
//     )
// }

// export default App;
