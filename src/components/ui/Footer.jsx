import React from "react";
import {Link, useNavigate} from "react-router-dom";
import Logo from "./Logo.jsx"

function Footer() {
    const navigate = useNavigate();

    return (
        <footer>
            <div className="links">
                <Link to={"/"}>Home</Link>
                <Link to={"/articles"}>Articles</Link>
                <Link to={"/profile"}>Profile</Link>
            </div>
            <Logo styling={"uni"}/>
            <a> BDS x BCC 2025 </a>
        </footer>
    )}

export default Footer;
