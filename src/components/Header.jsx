import React from "react";
import {useNavigate} from "react-router-dom";


function Header() {
    const navigate = useNavigate();

    return (
        <header>
            <div>
                <div onClick={() => navigate("/")}> LOGO STUFF</div>
                <button className="darkButton">Log out</button>
            </div>
            <nav className="navbar">Go here go there</nav>
        </header>
    )}

export default Header;
