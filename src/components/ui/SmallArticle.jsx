import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SmallArticle.module.css"; // Adjust path as needed

const SmallArticleCard = ({ article, detailed = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/articles/${article.id}`);
    };

    return (
        <div key={article.id} className={styles.smallArticleCon} onClick={handleClick}>
            <div className={styles.smallArticle}>
                <div className={styles.imageWrapper}>
                    <img
                        src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=300`}
                        alt={article.title}
                    />
                </div>

                <div className={styles.smallArticlesDesc}>
                    <div className={styles.smallArticlesHeader}>
                        <div>
                            <h2>{article.title}</h2>
                            <div className={styles.Underline}></div>
                        </div>
                        <p>{new Intl.DateTimeFormat("de-DE").format(new Date(article.timestamp))}</p>
                    </div>

                    {detailed && (
                        <div className={styles.ItemCon}>
                            {article.games?.map((g, i) => (
                                <div key={i} className={styles.ItemBox}>{g}</div>
                            ))}
                            {article.teams?.map((t, i) => (
                                <div key={i} className={styles.ItemBox}>{t}</div>
                            ))}
                            {article.players?.map((p, i) => (
                                <div key={i} className={styles.ItemBox}>{p}</div>
                            ))}
                        </div>
                    )}

                    <p>{article.text.slice(0, 120) + "[...]"}</p>

                    {detailed && (
                        <p><strong>Comments:</strong> {article.comment_count}</p>
                    )}
                </div>
            </div>
            <div className={styles.SmallLine} />
        </div>
    );
};

export default SmallArticleCard;
