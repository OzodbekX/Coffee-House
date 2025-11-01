import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import {Footer} from "./components/Footer";
import Main from "./pages/Main";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import "./styles/App.scss";

const App: React.FC = () => {
    return (
        <div className={"main-container"}>
            <Router>
                <Header/>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Main/>}/>
                        <Route path="/menu" element={<Menu/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Registration/>}/>
                    </Routes>
                </main>
                <Footer/>
            </Router>
        </div>
    );
};

export default App;
