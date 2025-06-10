import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as apiService from "../services/apiService";
import styles from "./Article.module.css";

function AdminPage() {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiService.getUsers();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [id]);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!users || users.length === 0) return <p>No users found.</p>;

    return (
        <div>
            <div className={styles.articleContainer}>
                {users.map(user => (
                    <div key={user.id}>{user.name}</div>
                ))}
            </div>
        </div>
    );
}

export default AdminPage;
