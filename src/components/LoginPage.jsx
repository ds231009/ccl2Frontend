import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as apiService from "../services/apiService.js";
import styles from "./LoginPage.module.css";

function Login() {
    const location = useLocation();
    const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'login')

    const [email, setEmail] = useState('admin@admin.a');
    const [password, setPassword] = useState('admin');
    const [name, setName] = useState('Ad');
    const [lastName, setLastName] = useState('Min');
    const [username, setUsername] = useState('Admin');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (mode === 'login') {
                console.log(email, password);
                const data = await apiService.login(email, password);
                console.log(data);

                navigate('/articles');
            } else {
                const userData = {
                    username,
                    name,
                    lastName,
                    email,
                    password,
                };

                console.log(userData)

                const data = await apiService.signup(userData);
                // No need to store token in localStorage - it's in cookies now
                navigate('/articles');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await apiService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout fails, redirect to login
            navigate('/login');
        }
    };

    return (
        <div className={styles.Form}>
            <div className={styles.FormCon}>
                <h1>{mode === 'signup' ? 'Sign Up' : 'Log In'}</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className={styles.InputForm}>
                    {mode === 'signup' && (
                        <>
                            <input className={styles.Input}
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input className={`${styles.Input} ${styles.halfForm}`}
                                   placeholder="First Name"
                                   type="text"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   required
                            />
                            <input className={`${styles.Input} ${styles.halfForm}`}
                               placeholder="Last Name"
                               type="text"
                               value={lastName}
                               onChange={(e) => setLastName(e.target.value)}
                               required
                            />
                        </>
                    )}
                    <input className={styles.Input}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input className={styles.Input}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={mode === 'signup' ? 'darkButton' : 'lightButton'}>
                        {mode === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                    <div className={styles.ChangeMode}>
                        {mode === 'signup' ?
                            <span>Already have an account? <strong onClick={() => setMode("login")}>Log in</strong></span>
                            :
                            <span>No account yet? <strong onClick={() => setMode("signup")}>Sign up</strong></span>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;