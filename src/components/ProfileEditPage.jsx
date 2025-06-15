import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/auth/check-auth", {
                    credentials: "include",
                });
                const authData = await res.json();
                if (!res.ok) throw new Error("Unauthorized");

                const userRes = await fetch(`http://localhost:3000/users/${authData.user.id}`, {
                    credentials: "include",
                });
                const userData = await userRes.json();
                if (!userRes.ok) throw new Error("Unauthorized");

                setUser(userData);
                setFormData({
                    username: userData.username || "",
                    email: userData.email || "",
                    first_name: userData.first_name || "",
                    last_name: userData.last_name || "",
                    password: "",
                });
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/users/${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Update failed");

            navigate("/profile");
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input name="username" value={formData.username} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label>
                    First Name:
                    <input name="first_name" value={formData.first_name} onChange={handleChange} />
                </label>
                <label>
                    Last Name:
                    <input name="last_name" value={formData.last_name} onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input name="password" type="password" value={formData.password} onChange={handleChange} />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate("/profile")}>Cancel</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
