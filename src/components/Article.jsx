import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import Footer from "./ui/Footer.jsx";
import Header from "./ui/Header.jsx";
import * as apiService from "../services/apiService";
import styles from "./Article.module.css";
import BigArticle from "./ui/BigArticle.jsx";

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
        <>
            < Header/>
            <main>
                <div className={styles.Articles}>
                    <div onClick={() => navigate("/articles")} className={styles.GoBack}>🠈 Go back</div>
                    <BigArticle article={article} detailed={true}/>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlePage;
