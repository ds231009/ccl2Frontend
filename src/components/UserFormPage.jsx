import { useState, useEffect } from 'react';
import "./UserFormPage.css";
import {Link, useNavigate, useParams} from 'react-router-dom';
import * as apiService from '../services/apiService.js';

function UserFormPage({ type }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        hero: '',
        email: '',
        info: '',
        password: ''
    });

    const { id } = useParams(); // ✅ Get user ID from URL
    const navigate = useNavigate();

    const isEdit = type === 'edit';

    useEffect(() => {
        if (isEdit && id) {
            fetchUser(id);
        }
    }, [isEdit, id]);

    const fetchUser = async (userId) => {
        setIsLoading(true);
        setError('');
        try {
            const user = await apiService.getUserById(userId);
            setFormData({
                name: user.name || '',
                surname: user.surname || '',
                hero: user.hero || '',
                email: user.email || '',
                info: user.info || '',
                password: '' // Don't pre-fill passwords
            });
        } catch (error) {
            setError(error.message || 'Failed to fetch user');
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await apiService.createUser(formData);
            navigate('/users');
        } catch (error) {
            setError(error.message || 'Something went wrong');
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const editUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await apiService.updateUser(id, formData); // Make sure your API accepts an ID
            navigate('/users');
        } catch (error) {
            setError(error.message || 'Something went wrong');
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const pageConfig = {
        header: isEdit ? 'Edit User' : 'Add User',
        onSubmit: isEdit ? editUser : addUser,
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="user-form-container">
            <h1>{pageConfig.header}</h1>
            <div className="buttons">
                <button onClick={handleLogout} className="btn">Logout</button>
                <Link to="/users" className="btn">Back to Users</Link>
            </div>
            <form onSubmit={pageConfig.onSubmit}>
                {['name', 'surname', 'hero', 'email', 'info', 'password'].map((field) => (
                    <div className="form-group" key={field}>
                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        <input
                            type={field === 'password' ? 'password' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required={field !== 'info'}
                        />
                    </div>
                ))}
                <button type="submit" className="btn">Submit</button>
            </form>
        </div>
    );
}

export default UserFormPage;
