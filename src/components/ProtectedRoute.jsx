import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import * as apiService from "../services/apiService.js";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await apiService.checkAuth();         // reuses your function
                setIsAuthenticated(true);  // success
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthenticated(false); // error or 401
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // or a spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
