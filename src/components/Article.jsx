import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import * as apiService from "../services/apiService";
import styles from "./Article.module.css";

function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await apiService.getArticle(id);
                setArticle(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    console.log(article);

    if (loading) return <p>Loading article...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!article) return <p>No article found.</p>;

    return (
        <div className="article-container">
            <Header />
            <main>
                <div className={styles.Articles}>
                    <div onClick={() => navigate("/articles/")} className={styles.GoBack}>🠈 Go back</div>
                    <div className={styles.firstArticle}>
                        <div className={styles.FirstImageWrapper}>
                            <img src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=1280`} alt={article.title} />
                        </div>
                        <div>
                             <h1>{article.title}</h1>
                        </div>
                        <span>
                            {'by '}
                            {article.authors.map((user, index) => (
                                <span key={user.id}>
                                    {user.first_name} {user.last_name}
                                    {index < article.authors.length - 1 && ', '}
                                </span>
                            ))}
                            {' | '}
                            {new Intl.DateTimeFormat('de-DE').format(new Date(article.timestamp))}
                        </span>
                        <div className={styles.Text}>
                            {article.text.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ArticlePage;
