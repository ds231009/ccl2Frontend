import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as apiService from "../services/apiService.js";
import styles from "./LoginPage.module.css";
import { useLocation } from "react-router-dom";

function Login() {
    const location = useLocation();
    const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (mode === 'login') {
                console.log(email, password);
                const data = await apiService.login(email, password);
                console.log(data);

                navigate('/');
            } else {
                const userData = {
                    username,
                    name,
                    lastName,
                    email,
                    password,
                };

                console.log(userData)

                await apiService.signup(userData);

                await apiService.login(userData.email, userData.password);
                navigate('/articles');
            }
        } catch (err) {
            navigate("/error", { state: { error: err } });
        }
    };

    return (
        <>
            <div className={styles.FormCon}>
                <h1>{mode === 'signup' ? 'Sign Up' : 'Log In'}</h1>
                <form onSubmit={handleSubmit} className="InputForm">
                    {mode === 'signup' && (
                        <>
                            <input className={"Input"}
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input className={`Input ${styles.halfForm}`}
                                   placeholder="First Name"
                                   type="text"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   required
                            />
                            <input className={`Input ${styles.halfForm}`}
                               placeholder="Last Name"
                               type="text"
                               value={lastName}
                               onChange={(e) => setLastName(e.target.value)}
                               required
                            />
                        </>
                    )}
                    <input className={"Input"}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input className={"Input"}
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
        </>
    );
}

export default Login;