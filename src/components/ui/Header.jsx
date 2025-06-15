import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as apiService from "../../services/apiService.js"
//import * as apiService from "../services/apiService"; // TODO LOGOUT IN APISERV

function Header() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

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
                            <button onClick={() => navigate("/writeArticle")}>Write</button>
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
