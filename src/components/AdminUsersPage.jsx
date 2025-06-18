import React, { useState, useEffect } from "react";
import * as apiService from "../services/apiService";

import Header from "./ui/Header.jsx";

import styles from "./Admin.module.css";
import {useNavigate} from "react-router-dom";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [roleFilter, setRoleFilter] = useState("all");
    const [sortKey, setSortKey] = useState("username");
    const [sortOrder, setSortOrder] = useState("asc");

    const [editUserId, setEditUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiService.getUsers();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                navigate("/error", { state: { error: err } });
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = [...users];
        if (roleFilter !== "all") {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        filtered.sort((a, b) => {
            let aKey = (a[sortKey] || "").toLowerCase();
            let bKey = (b[sortKey] || "").toLowerCase();

            if (aKey < bKey) return sortOrder === "asc" ? -1 : 1;
            if (aKey > bKey) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredUsers(filtered);
    }, [users, roleFilter, sortKey, sortOrder]);

    const handleEditClick = (user) => {
        setEditUserId(user.id);
        setEditFormData({
            username: user.username || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            role: user.role || "user",
        });
    };

    const handleCancelClick = () => {
        setEditUserId(null);
        setEditFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        try {
            // Call your API to update user
            console.log(editUserId,editFormData);
            const updatedUser = await apiService.updateUser(editUserId, editFormData);

            // Update local users state
            setUsers(prevUsers =>
                prevUsers.map(u => (u.id === editUserId ? updatedUser : u))
            );

            setEditUserId(null);
            setEditFormData({});
        } catch (err) {
            alert("Failed to update user: " + err.message);
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (!filteredUsers.length) return <p>No users found.</p>;

    return (
        <>
            <Header siteName={"Admin User Management"}/>
            <div className={styles.View}>
                <div className={styles.Filters}>
                    <label>
                        Filter by Role:
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="admin">Admin</option>
                            <option value="journalist">Journalist</option>
                            <option value="user">User</option>
                        </select>
                    </label>

                    <label>
                        Sort by:
                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                            <option value="username">Username</option>
                            <option value="first_name">First Name</option>
                            <option value="last_name">Last Name</option>
                        </select>
                    </label>

                    <label>
                        Order:
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </label>
                </div>

                <table className={styles.userTable}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            {editUserId === user.id ? (
                                <>
                                    <td><input name="username" value={editFormData.username} onChange={handleInputChange} /></td>
                                    <td><input  name="first_name" value={editFormData.first_name} onChange={handleInputChange} /></td>
                                    <td><input  name="last_name" value={editFormData.last_name} onChange={handleInputChange} /></td>
                                    <td><input  name="email" value={editFormData.email} onChange={handleInputChange} /></td>
                                    <td>
                                        <select name="role" value={editFormData.role} onChange={handleInputChange}>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="journalist">Journalist</option>
                                        </select>
                                    </td>
                                    <td className={styles.td}>
                                        <button className="lightButton" onClick={handleSaveClick}>Save</button>
                                        <button className="darkButton" onClick={handleCancelClick}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.username}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td className={styles.td}><button className="darkButton" onClick={() => handleEditClick(user)}>Edit</button></td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminUsersPage;