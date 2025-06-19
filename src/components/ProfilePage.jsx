import React, { useEffect, useState } from 'react';
import * as apiService from "../services/apiService";

import Header from "./ui/Header.jsx";
import Footer from "./ui/Footer.jsx";
import styles from "./ProfilePage.module.css";
import {useNavigate} from "react-router-dom";


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [editInfo, setEditInfo] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

    const navigate = useNavigate();

    const [infoForm, setInfoForm] = useState({
        id: "",
        username:"",
        email: "",
        first_name: "",
        last_name: "",
        role: "",
    });
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        new: "",
    });



    // Fetch auth info
    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/auth/check-auth", {
                    credentials: "include",
                });
                console.log("Auth check status:", res.status);
                const data = await res.json();
                if (!res.ok) throw new Error("Unauthorized");
                console.log("Auth user data:", data);
                setAuthUser(data.user);
            } catch (err) {
                navigate("/error", { state: { error: err } });
                setUser(null);
            }
        };
        fetchAuthUser();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!authUser?.id) {
                console.log("No auth user id yet");
                return;
            }
            try {
                const res = await fetch(`http://localhost:3000/users/${authUser.id}`, {
                    credentials: "include",
                });
                console.log("User fetch status:", res.status);
                const data = await res.json();
                if (!res.ok) throw new Error("Unauthorized");
                console.log("User details:", data);
                setUser(data);
                setInfoForm({
                    id: data.id,
                    username: data.username || "",
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    role: data.role || "",
                });
            } catch (err) {
                console.error("Fetching full user info failed", err);
            }
        };
        fetchDetails();
    }, [authUser?.id]);

    const handleInfoChange = (e) => {
        setInfoForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateUser(user.id, infoForm);

            setUser(prevUser => ({
                ...prevUser,
                ...infoForm,
            }));

            setEditInfo(false);
        } catch (err) {
            console.error("Update failed", err);
        }
    };


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/users/${user.id}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: passwordForm.current,
                    newPassword: passwordForm.new,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Password update failed");
            }

            setPasswordForm({ current: "", new: "" });
            setEditPassword(false);
            alert("Password changed successfully.");
        } catch (err) {
            console.error("Password update failed", err);
            alert(err.message || "Password update failed");
        }
    };


    console.log("form2", infoForm)

    if (!user) return <p>Loading profile...</p>;

    return (
        <>
            <Header siteName={"My Profile"} />
            <main>
                <div>
                    <dl>
                        <div>
                            <dt>First Name</dt>
                            <dd>{user.first_name}</dd>
                        </div>
                        <div>
                            <dt>Last Name</dt>
                            <dd>{user.last_name}</dd>
                        </div>
                        <div>
                            <dt>Username</dt>
                            <dd>{user.username}</dd>
                        </div>
                        <div>
                            <dt>Email</dt>
                            <dd>{user.email}</dd>
                        </div>
                    </dl>
                </div>
                <div className="header-buttons">
                    <button
                        className={editInfo ? "lightButton" : "darkButton"}
                        onClick={() => {
                            setEditInfo(!editInfo);
                            if (!editInfo) setEditPassword(false); // Close password if opening info
                        }}
                    >
                        {editInfo ? "Cancel Edit" : "Edit Info"}
                    </button>

                    <button
                        className={editPassword ? "lightButton" : "darkButton"}
                        onClick={() => {
                            setEditPassword(!editPassword);
                            if (!editPassword) setEditInfo(false); // Close info if opening password
                        }}
                    >
                        {editPassword ? "Cancel Password" : "Change Password"}
                    </button>
                </div>
                <div className={styles.EditCon}>
                    {editInfo && (
                        <div className={styles.FormCon}>
                            <form onSubmit={handleInfoSubmit} className={styles.InputForm}>
                                <h1>Edit Info</h1>
                                <label>
                                    Username<input name="username" value={infoForm.username} onChange={handleInfoChange} />
                                </label>
                                <label>
                                    Email<input name="email" value={infoForm.email} onChange={handleInfoChange} />
                                </label>
                                <label className={styles.halfForm}>
                                    First Name<input name="first_name" value={infoForm.first_name} onChange={handleInfoChange} />
                                </label>
                                <label className={styles.halfForm}>
                                    Last Name<input name="last_name" value={infoForm.last_name} onChange={handleInfoChange} />
                                </label>
                                <button className="lightButton" type="submit">Save Changes</button>
                            </form>
                        </div>
                    )}

                    {editPassword && (
                        <div className={styles.FormCon}>
                            <form onSubmit={handlePasswordSubmit} className={styles.InputForm}>
                                <h1>Change Password</h1>
                                <label>
                                    Current Password:
                                    <input
                                        type="password"
                                        name="current"
                                        value={passwordForm.current}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </label>
                                <label>
                                    New Password:
                                    <input
                                        type="password"
                                        name="new"
                                        value={passwordForm.new}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </label>
                                <button className="lightButton" type="submit">Update Password</button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ProfilePage;
