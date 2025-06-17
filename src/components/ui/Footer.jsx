import React from "react";
import {useNavigate} from "react-router-dom";


function Footer() {
    const navigate = useNavigate();

    return (
        <footer>
            <div onClick={() => navigate("/")}>Foot</div>
            <div onClick={() => navigate("/")}>Foot</div>
            <div onClick={() => navigate("/")}>Foot</div>
        </footer>
    )}

export default Footer;
