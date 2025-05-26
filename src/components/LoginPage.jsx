import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import * as apiService from '../services/apiService.js';

function LoginPage() {
    const [email, setEmail] = useState('admin@avengers.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const data = await apiService.login(email, password)
            localStorage.setItem('token', data.token)
            navigate('/users') // Redirect to users page after successful login
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    )

}


export default LoginPage