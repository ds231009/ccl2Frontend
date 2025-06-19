const API_BASE_URL = 'http://localhost:3000';

// Logs in a user with email and password
export const login = async (email, password) => {
    console.log(email, password);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) { // If Login data is wrong, throw error
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }
    return await response.json();
};

// Registers a new user with provided userData
export const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(user^Data),
    });
    if (!response.ok) throw new Error('Sign up failed');
    return response.json();
};

export const checkAuth = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/check-auth`, {
        credentials: "include",
    });
    if (!response.ok) throw new Error('Auth failed');
    return response.json();
};

// Logs out the currently authenticated user
export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    return response.ok;
};

// --------- Articles ---------

// Fetches articles based on optional filter parameters
export const getArticles = async (filters = {}) => {
    // Convert array values to comma-separated strings and remove null/undefined
    const validFilters = Object.fromEntries(
        Object.entries(filters)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v])
    );

    const query = new URLSearchParams(validFilters).toString();
    const url = `${API_BASE_URL}/articles${query ? `?${query}` : ""}`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

// Fetches articles for the homepage
export const getHomeArticles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

// Fetches a single article by its ID
export const getArticle = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            credentials: 'include',
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

// Updates an existing article by ID (Note: Should use PUT or PATCH instead of POST for updates)
export const updateArticle = async (id, articleData) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({id, articleData}),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return await response.json();
};

// Creates a new article with the given data
export const createArticle = async (articleData) => {
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

// --------- References ---------

// Fetches list of all games from references
export const getGames = async () => {
    const url = `${API_BASE_URL}/references/games`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

// Fetches list of all teams from references
export const getTeams = async () => {
    const url = `${API_BASE_URL}/references/teams`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

// Fetches list of all players from references
export const getPlayers = async () => {
    const url = `${API_BASE_URL}/references/players`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
};

// --------- Users ---------

// Fetches all users
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

// Fetches a specific user by their ID
export const getUserById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        credentials: 'include', // Include cookies (no Authorization header needed)
    });

    if (!response.ok) {
        throw new Error('User not found');
    }

    return await response.json();
};

export const postLike = async (userId, articleId) => {
    const response = await fetch(`${API_BASE_URL}/articles/interaction?articleId=${articleId}&userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({userId, articleId}),
    });
}

export const deleteLike = async (userId, articleId) => {
    const response = await fetch(`${API_BASE_URL}/articles/interaction?articleId=${articleId}&userId=${userId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
}

export const postComment = async (userId, articleId, commentText) => {
    const response = await fetch(`${API_BASE_URL}/articles/comment?articleId=${articleId}&userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({commentText}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User creation failed');
    }

    return await response.json();
}

// Creates a new user (admin-level action or sign-up)
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

// Updates an existing user by ID (Note: body structure nests userData, could be simplified)
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

// Deletes a user by ID
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