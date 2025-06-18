// /ErrorPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
    const location = useLocation();
    const error = location.state?.error;

    return (
        <div className="error-page">
            <h1>Error</h1>
            <p>{error?.message || "An unexpected error occurred."}</p>
        </div>
    );
};

export default ErrorPage;
