import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import * as apiService from "../services/apiService";

function AdminRoute({ children }) {
    const [status, setStatus] = useState("loading"); // "loading", "unauthenticated", "unauthorized", "authorized"

    useEffect(() => {
        const checkUserAccess = async () => {
            try {
                const userData = await apiService.checkAuth();

                if (userData.user.role !== "admin" && userData.user.role !== "journalist") {
                    setStatus("unauthorized");
                    return;
                }

                setStatus("authorized");
            } catch (error) {
                console.error("Auth check failed:", error);
                setStatus("unauthenticated");
            }
        };

        checkUserAccess();
    }, []);


    if (status === "loading") return <div>Loading...</div>;
    if (status === "unauthenticated") return <Navigate to="/login" replace />;
    if (status === "unauthorized") return <Navigate to="/unauthorized" replace />;

    return children;
}

export default AdminRoute;
