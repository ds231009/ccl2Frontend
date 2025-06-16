import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as apiService from "../../services/apiService.js"
//import * as apiService from "../services/apiService"; // TODO LOGOUT IN APISERV

function Header() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        const cookies = `; ${document.cookie}`;
        const parts = cookies.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(";").shift() : null;
    }

    useEffect(() => {
        const saved = getCookie("theme") || "light";
        setTheme(saved);
        document.body.setAttribute("data-theme", saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        setCookie("theme", next, 30);
        // document.body.setAttribute("data-theme", next);
        document.body.classList.remove("light", "dark");
        document.body.classList.add(next); // 'dark' or 'light'
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/auth/check-auth", {
                    credentials: "include", // Important to send cookies
                });

                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();
                setUser(data.user); // { id, username, role }
            } catch (err) {
                console.error("Not logged in or token invalid", err);
                setUser(null);
            }
        };

        fetchUser();
    }, []);


    const handleLogout = async () => {
        await apiService.logout();
        navigate('/');
    }


    return (
        <header>
            <div>
                <div onClick={() => navigate("/")}> LOGO STUFF</div>
                <button onClick={toggleTheme}>
                    Switch to {theme === "light" ? "Dark" : "Light"} Mode
                </button>
                <div className="header-buttons">
                    {user?.role === "admin" && (
                        <>
                            <button className="adminButton" onClick={() => navigate("/users")}>Users</button>
                            <button className="adminButton" onClick={() => navigate("/references")}>References</button>
                            <button className="adminButton" onClick={() => navigate("/admin-articles")}>Articles</button>
                            |
                        </>
                    )}

                    {user?.role === "journalist" || user?.role === "admin" && (
                        <>
                            <button className="darkButton" onClick={() => navigate("/writeArticle")}>Write</button>
                            |
                        </>
                    )}
                    <button className="lightButton" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="darkButton" onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </header>
    )}

export default Header;
