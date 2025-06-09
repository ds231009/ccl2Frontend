const API_BASE_URL = 'http://localhost:3000';

export const login = async (email, password) => { // Login
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) { // If Login data is wrong, throw error
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }
    return await response.json(); // includes token
};

export const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Sign up failed');
    return response.json();
};

export const getUsers = async () => { // Fetches User Data
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) { // Error
            throw new Error('Failed to fetch users');
        }

        return await response.json();

    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

export const getArticles = async (filters = {}) => {
    // Remove null or undefined values
    const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null)
    );

    const query = new URLSearchParams(validFilters).toString();
    const url = `http://localhost:3000/articles${query ? `?${query}` : ""}`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

export const getGames = async () => {
    const url = `http://localhost:3000/references/games`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

export const getTeams = async () => {
    const url = `http://localhost:3000/references/teams`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

export const getPlayers = async () => {
    const url = `http://localhost:3000/references/players`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

export const getHomeArticles = async () => {
    try {
        const response = await fetch(`http://localhost:3000/`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export const getArticle = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/articles/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export const getUserById = async (id) => { // Fetch specific user by id
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('User not found');
    }

    return await response.json();
};

export const createUser = async (userData) => { // Creates new user
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User creation failed');
    }

    return await response.json();
};

export const updateUser = async (id, userData, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return await response.json();
};

export const deleteUser = async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return { message: 'User deleted successfully' };
};
