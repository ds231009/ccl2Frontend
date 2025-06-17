import React, { useState, useEffect } from "react";
import * as apiService from "../services/apiService";

import Header from "./ui/Header.jsx";
import styles from "./Admin.module.css";

function AdminArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortKey, setSortKey] = useState("timestamp");
    const [sortOrder, setSortOrder] = useState("desc");

    const [editArticleId, setEditArticleId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await apiService.getArticles();
                setArticles(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        let sorted = [...articles];
        sorted.sort((a, b) => {
            let aKey = (a[sortKey] || "").toLowerCase();
            let bKey = (b[sortKey] || "").toLowerCase();

            if (aKey < bKey) return sortOrder === "asc" ? -1 : 1;
            if (aKey > bKey) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredArticles(sorted);
    }, [articles, sortKey, sortOrder]);

    const handleEditClick = (article) => {
        setEditArticleId(article.id);
        setEditFormData({
            title: article.title || "",
            text: article.text || "",
            authors: article.authors || [],
            date: article.timestamp || "",
            games: article.games || [],
            teams: article.teams || [],
            players: article.players || [],
        });
    };

    const handleCancelClick = () => {
        setEditArticleId(null);
        setEditFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e, field) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault();
            setEditFormData(prev => ({
                ...prev,
                [field]: [...prev[field], e.target.value.trim()]
            }));
            e.target.value = "";
        }
    };

    const handleRemoveItem = (field, index) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSaveClick = async () => {
        try {
            const updatedArticle = await apiService.updateArticle(editArticleId, editFormData);
            setArticles(prev =>
                prev.map(a => (a.id === editArticleId ? updatedArticle : a))
            );
            setEditArticleId(null);
            setEditFormData({});
        } catch (err) {
            alert("Failed to update article: " + err.message);
        }
    };

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!filteredArticles.length) return <p>No articles found.</p>;

    return (
        <>
            <Header siteName={"Admin Article Management"}/>
            <div className={styles.View}>
                <div className={styles.Filters}>
                    <label>
                        Sort by:
                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                            <option value="title">Title</option>
                            <option value="text">Text</option>
                            <option value="timestamp">Date</option>
                        </select>
                    </label>

                    <label>
                        Order:
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </label>
                </div>

                <table className={styles.userTable}>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Text</th>
                        <th>Authors</th>
                        <th>Games</th>
                        <th>Teams</th>
                        <th>Players</th>
                        <th>&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredArticles.map(article => (
                        <tr key={article.id}>
                            {editArticleId === article.id ? (
                                <>
                                    <td>{article.timestamp}</td>
                                    <td>
                                        <input
                                            name="title"
                                            value={editFormData.title}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                    <td>
                                            <textarea
                                                name="text"
                                                value={editFormData.text}
                                                onChange={handleInputChange}
                                            />
                                    </td>
                                    <td>
                                        <input
                                            name="authors"
                                            value={editFormData.authors}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.tagInput}>
                                            {editFormData.games.map((g, i) => (
                                                <span key={i} className={styles.tag}>
                                                        {g}
                                                    <button onClick={() => handleRemoveItem("games", i)}>x</button>
                                                    </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder="Add game"
                                                onKeyDown={(e) => handleAddItem(e, "games")}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tagInput}>
                                            {editFormData.teams.map((t, i) => (
                                                <span key={i} className={styles.tag}>
                                                        {t}
                                                    <button onClick={() => handleRemoveItem("teams", i)}>x</button>
                                                    </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder="Add team"
                                                onKeyDown={(e) => handleAddItem(e, "teams")}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tagInput}>
                                            {editFormData.players.map((p, i) => (
                                                <span key={i} className={styles.tag}>
                                                        {p}
                                                    <button onClick={() => handleRemoveItem("players", i)}>x</button>
                                                    </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder="Add player"
                                                onKeyDown={(e) => handleAddItem(e, "players")}
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <button className="lightButton" onClick={handleSaveClick}>Save</button>
                                        <button className="darkButton" onClick={handleCancelClick}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{article.timestamp}</td>
                                    <td>{article.title}</td>
                                    <td>HERE ARTICLE TEXT</td>
                                    <td>{article.authors?.join(", ")}</td>
                                    <td>{article.games?.join(", ")}</td>
                                    <td>{article.teams?.join(", ")}</td>
                                    <td>{article.players?.join(", ")}</td>
                                    <td className={styles.td}>
                                        <button className="lightButton" onClick={() => handleEditClick(article)}>Edit</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminArticlesPage;
