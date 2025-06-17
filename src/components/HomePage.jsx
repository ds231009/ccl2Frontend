import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import * as apiService from "../services/apiService.js";

import CurrentDate from "./ui/CurrentDate";
import Header from "./ui/Header.jsx";
import Footer from "./ui/Footer.jsx";
import SmallArticleCard from "./ui/SmallArticle.jsx";
import BigArticle from "./ui/BigArticle.jsx";

import styles from "./HomePage.module.css";


function HomePage() {
    const [articles, setArticles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const handleLogout = async () => {
        await apiService.logout();
        await fetchUser()
        navigate('/');
    }

    const fetchArticles = async () => {
        try {
            const data = await apiService.getHomeArticles();
            setArticles(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await apiService.checkAuth()

            if (!res.ok) throw new Error("Unauthorized");

            const data = await res.json();
            setUser(data.user); // { id, username, role }
        } catch (err) {
            console.error("Not logged in or token invalid", err);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchArticles();

        fetchUser();
    }, []);

    console.log(articles);

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!articles || articles.length === 0) return <p>No article found.</p>;

    return (
        <div>
            <Header mode="home"/>
            <main>
                <div className={styles.Articles}>
                    <BigArticle article={articles[0]}/>
                    <div className={styles.MidLine} />
                    <div className={styles.smallArticles}>
                        {articles.slice(1).map(article => (
                            <SmallArticleCard key={article.id} article={article} />
                        ))}
                    <button onClick={() => navigate("/articles?page=1")} className="darkButton">See more</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;
