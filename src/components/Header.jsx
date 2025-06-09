import React from "react";
import {useNavigate} from "react-router-dom";


function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("logged out");
        await fetch(`http://localhost:3000/auth/logout`);
        navigate('/');
    }

    return (
        <header>
            <div>
                <div onClick={() => navigate("/")}> LOGO STUFF</div>
                <button className="darkButton" onClick={handleLogout}>Log out</button>
            </div>
            <nav className="navbar">Go here go there</nav>
        </header>
    )}

export default Header;
