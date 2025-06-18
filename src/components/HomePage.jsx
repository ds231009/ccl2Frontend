import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import * as apiService from "../services/apiService.js";

import Header from "./ui/Header.jsx";
import Footer from "./ui/Footer.jsx";
import SmallArticleCard from "./ui/SmallArticle.jsx";
import BigArticle from "./ui/BigArticle.jsx";

import styles from "./HomePage.module.css";


function HomePage() {
    const [articles, setArticles] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchArticles = async () => {
        try {
            const data = await apiService.getHomeArticles();
            console.log(data);
            setArticles(data);
        } catch (err) {
            navigate("/error", { state: { error: err } });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchArticles();
    }, []);

    console.log(articles);

    if (loading) return <p>Loading articles...</p>;
    if (!articles || articles.length === 0) return <p>No article found.</p>;

    return (
        <>
            <Header mode="home"/>
            <main>
                <div className={styles.Articles}>
                    <BigArticle article={articles[0]} />
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
        </>
    );
}

export default HomePage;
