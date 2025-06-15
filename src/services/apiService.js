const API_BASE_URL = 'http://localhost:3000';

export const login = async (email, password) => { // Login
    console.log(email, password);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) { // If Login data is wrong, throw error
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }
    return await response.json();
};

export const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Sign up failed');
    return response.json();
};

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    return response.ok;
};

// Articles

export const getArticles = async (filters = {}) => {
    // Convert array values to comma-separated strings and remove null/undefined
    const validFilters = Object.fromEntries(
        Object.entries(filters)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
    );

    const query = new URLSearchParams(validFilters).toString();
    const url = `http://localhost:3000/articles${query ? `?${query}` : ""}`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include', // Include cookies
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};


export const getHomeArticles = async () => {
    try {
        const response = await fetch(`http://localhost:3000/`, {
            credentials: 'include', // Include cookies
        });
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
        const response = await fetch(`http://localhost:3000/articles/${id}`, {
            credentials: 'include', // Include cookies
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export const updateArticle = async (id, articleData) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies (no token parameter needed)
        body: JSON.stringify({id, articleData}),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return await response.json();
};

export const createArticle = async (articleData) => { // Creates new user
    const response = await fetch(`${API_BASE_URL}/articles/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(articleData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User creation failed');
    }

    return await response.json();
};

// References

export const getGames = async () => {
    const url = `http://localhost:3000/references/games`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include', // Include cookies
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

export const getTeams = async () => {
    const url = `http://localhost:3000/references/teams`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include', // Include cookies
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

export const getPlayers = async () => {
    const url = `http://localhost:3000/references/players`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include', // Include cookies
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

// Users

export const getUsers = async () => { // Fetches User Data
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            credentials: 'include',
        })

        if (!response.ok) { // Error
            throw new Error('Failed to fetch users');
        }

        return await response.json();

    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

export const getUserById = async (id) => { // Fetch specific user by id
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        credentials: 'include', // Include cookies (no Authorization header needed)
    });

    if (!response.ok) {
        throw new Error('User not found');
    }

    return await response.json();
};

export const createUser = async (userData) => { // Creates new user
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User creation failed');
    }

    return await response.json();
};

export const updateUser = async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies (no token parameter needed)
        body: JSON.stringify({id, userData}),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return await response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies (no token parameter needed)
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return { message: 'User deleted successfully' };
};