import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as apiService from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ArticlesList() {
    const [searchParams] = useSearchParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const player = searchParams.get("player");
    const team = searchParams.get("team");
    const game = searchParams.get("game");

    useEffect(() => {
        apiService
            .getArticles({ player, team, game })
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [player, team, game]);

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Header />
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
            <Footer />
        </div>
    );
}

export default ArticlesList;
