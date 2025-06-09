import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

import styles from "./HomePage.module.css";



function HomePage() {
    const [articles, setArticles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
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

        fetchArticles();
    }, []);

    console.log(articles);

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!articles || articles.length === 0) return <p>No article found.</p>;

    return (
        <div>
            <main>
                <div className={styles.header}>
                    <div>NAV Ig</div>
                    <div>LOGO</div>
                    <div className={styles.buttons}>
                        <button className="darkButton">Log in</button>
                        <button className="lightButton">Sign up</button>
                    </div>
                </div>
                <div className={styles.Articles}>
                    <div onClick={() => navigate("/articles/"+articles[0].id)} className={styles.firstArticle} loading="lazy">
                        <div className={styles.FirstImageWrapper}>
                            <img src={`http://localhost:3000/thumbnail/${articles[0].img_path}.jpg?width=960`} alt={articles[0].title} />
                        </div>
                        <div>
                            <div>
                                <h1>{articles[0].title}</h1>
                                <div className={styles.Underline}></div>
                            </div>
                            <p>{new Intl.DateTimeFormat('de-DE').format(new Date(articles[0].timestamp))}</p>
                        </div>
                        <p>{articles[0].text.slice(0,300) + " [...]"}</p>
                    </div>
                    <div className={styles.MidLine} />
                    <div className={styles.smallArticles}>
                        {articles.slice(1).map(article => (
                            <div onClick={() => navigate("/articles/"+article.id)} key={article.id} className={styles.smallArticleCon}>
                                <div className={styles.smallArticle}>
                                    <div className={styles.imageWrapper}>
                                        <img src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=300`} alt={article.title} loading="lazy"/>

                                    </div>
                                    <div className={styles.smallArticlesDesc}>
                                        <div>
                                            <div>
                                                <h2>{article.title}</h2>
                                                <div className={styles.Underline}></div>
                                            </div>
                                            <p>{new Intl.DateTimeFormat('de-DE').format(new Date(article.timestamp))}</p>
                                        </div>
                                        <p>{article.text.slice(0,200) + "[...]"}</p>
                                    </div>
                                </div>
                                <div className={styles.SmallLine}/>
                            </div>
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
