import { useState } from 'react';
import './DemoFrontend.css';
import './styles.css';
import {
    login as loginUser,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../services/apiService.js';

function DemoFrontend() {
    const [email, setEmail] = useState('ironman@avengers.com');
    const [password, setPassword] = useState('ironman');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiResponse, setApiResponse] = useState(null);

    // Handles user login and stores token
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);

        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);
        } catch (error) {
            setLoginError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Clears auth state
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        setApiError('');
        setApiResponse(null);
    };

    const handleApiCall = async (apiFunction, ...args) => {
        setLoading(true);
        setApiError('');
        setApiResponse(null);

        try {
            const token = localStorage.getItem('token');
            const result = await apiFunction(...args, token);
            setApiResponse(result);
        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllUsers = () => handleApiCall(getUsers);

    const handleGetUserById = () => {
        const id = prompt('Enter User ID:');
        if (id) handleApiCall(getUserById, id);
    };

    const handleCreateUser = () => {
        const name = prompt('Enter Name:');
        const email = prompt('Enter Email:');
        const password = prompt('Enter Password:');
        if (name && email && password) {
            handleApiCall(createUser, { name, email, password });
        }
    };

    const handleUpdateUser = () => {
        const id = prompt('Enter User ID to update:');
        const name = prompt('Enter New Name:');
        if (id && name) {
            handleApiCall(updateUser, id, { name });
        }
    };

    const handleDeleteUser = () => {
        const id = prompt('Enter User ID to delete:');
        if (id) handleApiCall(deleteUser, id);
    };

    // Return view
    return (
        <div className="demo-frontend">
            {!isLoggedIn ? (
                <div className="login-section">
                    <h2>Login</h2>
                    {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                    <form onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="api-section">
                    <div className="header">
                        <h2>API Routes</h2>
                        <button onClick={handleLogout}>Logout</button>
                    </div>

                    <div className="api-buttons">
                        <h3>User Management</h3>
                        <button onClick={handleGetAllUsers}>Get All Users</button>
                        <button onClick={handleGetUserById}>Get User by ID</button>
                        <button onClick={handleCreateUser}>Create New User</button>
                        <button onClick={handleUpdateUser}>Update User</button>
                        <button onClick={handleDeleteUser}>Delete User</button>

                        <h3>Authentication</h3>
                        <button disabled>Login (Already Implemented)</button>
                    </div>

                    {loading && <p>Loading...</p>}
                    {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
                    {apiResponse && (
                        <div className="api-result">
                            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DemoFrontend;
