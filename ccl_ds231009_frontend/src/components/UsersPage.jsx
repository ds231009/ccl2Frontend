import { useState, useEffect } from 'react';
import './UsersPage.css';
import {Link, useNavigate} from 'react-router-dom';
import * as apiService from '../services/apiService.js';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("false");
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setIsLoading(true)
        setError('')
        try {
            const data = await apiService.getUsers()
            setUsers(data)
        } catch (error) {
            setError(error.message)
            if (error.status === 401 || error.status === 403) {
                navigate('/login') // Redirect to login if not authenticated
            }
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    if (isLoading) return <div>Loading users...</div>
    if (error) return <div style={{ color: 'red' }}>{error}</div>

    return (
        <body>
            <div className="user-page-container">
                <h1>Users Overview</h1>
                <div className="buttons">
                    <button onClick={handleLogout} className="btn">Logout</button>
                    <Link to="/users/new" className="btn">Create New User</Link>
                </div>
                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            <span>{user.name} {user.surname} ({user.email})</span>
                            <span className="user-actions">
                                <Link to={`/users/${user.id}`}>View</Link>
                                <Link to={`/users/${user.id}/edit`}>Edit</Link>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </body>
    )
}

export default UsersPage;
