import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as apiService from "../../services/apiService";
import styles from "./Header.module.css";

import CurrentDate from "./CurrentDate";
import Logo from "./Logo";

function Header({ mode = "other", siteName = "" }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState("light");

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
        document.body.classList.remove("light", "dark");
        document.body.classList.add(saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        setCookie("theme", next, 30);
        document.body.classList.remove("light", "dark");
        document.body.classList.add(next);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/auth/check-auth", {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                console.log(data);
                setUser(data.user);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await apiService.logout();
        navigate("/");
        setUser(null);
    };

    return (
        <header>
            <div>
                {mode === 'home' ?
                    <CurrentDate />
                    :
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
                        <Logo />
                        <h2>{siteName}</h2>
                    </div>

                }
                {mode === 'home' ?
                    <Logo /> : <div></div>
                }
                <div className="header-buttons">
                    {!user || !user.role ? (
                        <>
                            <button onClick={() => navigate("/login")}>Login</button>
                            <button
                                onClick={() => navigate("/login", { state: { mode: "signup" } })}
                                className="lightButton"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={"switchButton"} onClick={toggleTheme}>
                                {theme === "light" ? "☾" : "☀"}
                            </button>
                            {user.role === "admin" && (
                                <>
                                    <button className="adminButton" onClick={() => navigate("/users")}>
                                        Users
                                    </button>
                                    <button className="adminButton" onClick={() => navigate("/references")}>
                                        References
                                    </button>
                                    <button className="adminButton" onClick={() => navigate("/admin-articles")}>
                                        Articles
                                    </button>
                                    |
                                </>
                            )}
                            {(user.role === "journalist" || user.role === "admin") && (
                                <>
                                    <button className="darkButton" onClick={() => navigate("/writeArticle")}>
                                        Write
                                    </button>
                                    |
                                </>
                            )}
                            <button className="lightButton" onClick={() => navigate("/profile")}>
                                Profile
                            </button>
                            <button className="darkButton" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header;
