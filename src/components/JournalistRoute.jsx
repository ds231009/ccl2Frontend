import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const [status, setStatus] = useState("loading"); // "loading", "unauthenticated", "unauthorized", "authorized"

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:3000/auth/check-auth", {
                    credentials: "include",
                });

                if (!res.ok) {
                    setStatus("unauthenticated");
                    return;
                }

                const user = await res.json();

                if ((user.user.role !== "admin") && (user.user.role !== "journalist")) {
                    setStatus("unauthorized");
                    return;
                }

                setStatus("authorized");
            } catch (error) {
                console.error("Auth check failed:", error);
                setStatus("unauthenticated");
            }
        };

        checkAuth();
    }, []);

    if (status === "loading") return <div>Loading...</div>;
    if (status === "unauthenticated") return <Navigate to="/login" replace />;
    if (status === "unauthorized") return <Navigate to="/unauthorized" replace />;

    return children;
}

export default AdminRoute;
