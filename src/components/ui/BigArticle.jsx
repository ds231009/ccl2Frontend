import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BigArticle.module.css";

const BigArticleCard = ({ article, detailed = false }) => {
    const navigate = useNavigate();

    if (!article) return null;

    const handleClick = () => {
        if (!detailed) navigate("/articles/" + article.id);
    };

    return (
        <div
            className={styles.firstArticle}
            onClick={handleClick}
            // style={{ cursor: detailed ? "default" : "pointer" }}
        >
            <div className={styles.FirstImageWrapper}>
                <img
                    src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=1280`}
                    alt={article.title}
                />
            </div>

            <div className={styles.Title}>
                <h1>{article.title}</h1>
                <div className={styles.Underline}></div>
            </div>

            <span className={styles.metaInfo}>
                {"by "}
                {article.authors?.map((user, index) => (
                    <span key={user.id}>
                        {user.first_name} {user.last_name}
                        {index < article.authors.length - 1 && ", "}
                    </span>
                ))}
                {" | "}
                {new Intl.DateTimeFormat("de-DE").format(new Date(article.timestamp))}
            </span>

            {detailed ? (
                <div className={styles.Text}>
                    {article.text.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            ) : (
                <p className={styles.summary}>
                    {article.text.length > 300
                        ? article.text.slice(0, 300) + " [...]"
                        : article.text}
                </p>
            )}
        </div>
    );
};

export default BigArticleCard;
