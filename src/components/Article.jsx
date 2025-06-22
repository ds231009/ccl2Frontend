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
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await apiService.postComment(user.id, article.id, commentText);

            const newComment = {
                comment: commentText,
                author: user.username,
                timestamp: Date.now(),
            }
            // Append new comment to article
            setArticle(prev => ({
                ...prev,
                comments : [newComment, ...prev.comments],
            }));

            // Clear input
            setCommentText('');
        } catch (err) {
            console.error("Error posting comment:", err);
            // Optionally show error to user
        }
    };

    function timeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 5) return '5min ago';
        if (diffInMinutes < 10) return '10min ago';
        if (diffInMinutes < 20) return '20min ago';
        if (diffInMinutes < 30) return '30min ago';
        if (diffInMinutes < 60) return '1h ago';

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 2) return '2h ago';
        if (diffInHours < 4) return '4h ago';
        if (diffInHours < 8) return '8h ago';
        if (diffInHours < 12) return '12h ago';
        if (diffInHours < 24) return '1d ago';

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }




    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.checkAuth();
                if (!data.user) throw new Error("No user");
                console.log(data.user);

                setUser(data.user);
            } catch (err) {
                navigate("/error", { state: { error: err } });
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
                    <div className={styles.comments}>
                        <h2>Comment</h2>
                        <form onSubmit={handleCommentSubmit}>
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{ width: '50%' }}
                                placeholder="Write Comment..."
                            />
                            <button className="lightButton" type="submit">Comment</button>
                        </form>
                            <div>
                                {article.comments.map(comment => (
                                    <div className={styles.comment} key={comment.id}>
                                        <div>
                                            <b>{comment.author}</b>:
                                            <p>{comment.comment}</p>
                                        </div>

                                        <span
                                            className={`${styles.commentTime} ${timeAgo(comment.timestamp) === "just now" ? styles.active : ""}`}
                                        >
                                            {timeAgo(comment.timestamp)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlePage;
