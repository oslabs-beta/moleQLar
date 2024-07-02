import React, { createContext, useContext, useState, useEffect } from "react";

// create Auth context
const AuthContext = createContext();  // allow props to check if user is authorized
const userAuth = () => useContext(AuthContext);


const ProvideAuth = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // verify the token and set the user
            setUser({ token });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

export default ProvideAuth;