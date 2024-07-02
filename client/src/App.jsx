import React from "react";
import MainPage from "./components/MainPage.jsx";
import Navbar from './components/NavBar.jsx';
import './components/Styles/styles.css'
const App = () =>{
    return(
        <div className="App">
       <Navbar/>
       <MainPage/>
        </div>
    )
}

export default App;
