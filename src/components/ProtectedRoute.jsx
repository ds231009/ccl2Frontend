import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:3000/auth/check-auth", {
                    credentials: "include",
                });

                setIsAuthenticated(res.ok); // true for 200, false for 401/403
            } catch (error) {
                console.error("Network error while checking auth:", error);
                setIsAuthenticated(false); // network failure (not just unauth)
            }
        };

        checkAuth();
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
