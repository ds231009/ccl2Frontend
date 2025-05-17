import { useState, useEffect } from 'react';
import './UserDetailPage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as apiService from '../services/apiService.js';

function UserDetailPage() {
    const [user, setUser] = useState(null); // ✅ holds a single user
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchUser = async (userId) => {
        setIsLoading(true);
        setError('');
        try {
            const fetchedUser = await apiService.getUserById(userId);
            setUser(fetchedUser);
        } catch (error) {
            setError(error.message || 'Failed to fetch user');
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchUser(id); // ✅ call on mount
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (isLoading) return <div>Loading user...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div>No user found.</div>;

    return (
        <body>
            <div className="user-detail-container">
                <h1>User Details</h1>
                <div className="buttons">
                    <button onClick={handleLogout} className="btn">Logout</button>
                    <Link to="/users/new" className="btn">Create New User</Link>
                    <Link to="/users" className="btn">Back to Users</Link>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Surname:</strong> {user.surname}</p>
                    <p><strong>Hero:</strong> {user.hero}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Info:</strong> {user.info}</p>
                </div>
            </div>
        </body>
    );
}

export default UserDetailPage;
