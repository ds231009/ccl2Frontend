import React, { useState, useEffect } from "react";

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/articles")
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Articles</h1>
            {articles.length === 0 && <p>No articles found.</p>}
            {articles.map(article => (
                <div key={article.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
                    <h2>{article.title}</h2>
                    <p>{article.text}</p>
                    <p><strong>Players:</strong> {article.players.join(", ")}</p>
                    <p><strong>Teams:</strong> {article.teams.join(", ")}</p>
                    <p><strong>Games:</strong> {article.games.join(", ")}</p>
                    <p><strong>Comments:</strong> {article.comment_count}</p>
                </div>
            ))}
        </div>
    );
}

export default ArticleList;
