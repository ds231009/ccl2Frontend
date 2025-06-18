import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import Footer from "./ui/Footer.jsx";
import Header from "./ui/Header.jsx";
import * as apiService from "../services/apiService";
import styles from "./Article.module.css";
import BigArticle from "./ui/BigArticle.jsx";
import articles from "./Articles.jsx";

function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const newComment = await apiService.postComment(user.id, article.id, commentText);

            // Append new comment to article
            setArticle(prev => ({
                ...prev,
                comments : [...prev.comments, newComment],
            }));

            // Clear input
            setCommentText('');
        } catch (err) {
            console.error("Error posting comment:", err);
            // Optionally show error to user
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.checkAuth();
                if (!data.user) throw new Error("No user");

                setUser(data.user);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await apiService.getArticle(id);
                console.log("Article", data);
                setArticle(data);
                setLoading(false);
            } catch (err) {
                navigate("/error", { state: { error: err } });
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    console.log(article);

    if (loading) return <p>Loading article...</p>;
    if (!article) return <p>No article found.</p>;

    return (
        <>
            < Header/>
            <main>
                <div className={styles.Articles}>
                    <div onClick={() => navigate("/articles")} className={styles.GoBack}>🠈 Go back</div>
                    <BigArticle article={article} detailed={true} user={user}/>
                    <div>
                        <h2>Comment</h2>
                        <form onSubmit={handleCommentSubmit}>
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{ width: '50%' }}
                                placeholder="Write Comment..."
                            />
                            <button className="lightButton" type="submit">Comment</button>
                            <div>
                                {article.comments.map(comment => (
                                    <div key={comment.id}><b> {comment.author}</b>: {comment.comment}</div>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlePage;
