import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import * as apiService from "../services/apiService";

function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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


    if (loading) return <p>Loading article...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!article) return <p>No article found.</p>;

    const { title, text, img_path, authors, comments } = article;

    return (
        <div className="article-container">
            <Header />
            <main style={{ padding: "1rem" }}>
                <h1>{title}</h1>
                <img src={img_path} alt={title} style={{ maxWidth: "100%" }} />
                <p>{text}</p>

                <section>
                    <h2>Authors</h2>
                    <ul>
                        {authors.map((author, index) => (
                            <li key={index}>
                                {author.first_name} {author.last_name} ({author.username}) - {author.role}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Comments</h2>
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>{comment.comment}</li>
                        ))}
                    </ul>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default ArticlePage;
