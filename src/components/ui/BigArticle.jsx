import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./BigArticle.module.css";
import * as apiServices from "../../services/apiService.js";

const BigArticleCard = ({ article, detailed = false, user }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState(() => {
        if (!Array.isArray(article.likes)) return -1;
        return article.likes.length > 0 ? article.likes.length : "";
    });

    console.log("CHECK LIKE",article.likes, user)

    useEffect(() => {
        if (!user || !article || !Array.isArray(article.likes)) {
            setToggle(false);
            return;
        }

        const liked = article.likes.some(like => like.id === user.id);
        setToggle(liked);
    }, [user, article]);


    const handleLike = async () => {
        if (!user || !id) return;

        setLoading(true);
        try {
            if (!toggle) {
                await apiServices.postLike(user.id, id);
                setLikes(prev => (typeof prev === "number" ? prev + 1 : 1));
                setToggle(true);
            } else {
                await apiServices.deleteLike(user.id, id);
                setLikes(prev => {
                    if (typeof prev !== "number") return "";
                    return prev - 1 > 0 ? prev - 1 : "";
                });
                setToggle(false);
            }
        } catch (err) {
            console.error("API error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!article) return null;

    const handleClick = () => {
        if (!detailed) navigate("/articles/" + article.id);
    };

    return (
        <div className={styles.firstArticle}>
            <div
                className={styles.FirstImageWrapper}
                onClick={!detailed ? handleClick : undefined}
                style={{ cursor: detailed ? "default" : "pointer" }}
            >
                <img
                    src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=1280`}
                    alt={article.title}
                />
            </div>

            <div
                className={styles.Header}
                onClick={!detailed ? handleClick : undefined}
                style={{ cursor: detailed ? "default" : "pointer" }}
            >
                <div className={styles.Title}>
                    <h1>{article.title}</h1>
                    <div className={styles.Underline}></div>
                </div>

                {detailed && (
                    <div
                        onClick={handleLike}
                        className={`${styles.Likes} ${toggle ? "active" : "passive"}`}
                        title={!user ? "Login to like this article" : ""}
                    >
                        <span>{likes}</span>
                        <svg className={styles.likeSvg} viewBox="0 0 130 130">
                            <path
                                className={styles.likeIcon}
                                d="M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <span className={styles.metaInfo}>
                {"by "}
                {article.authors?.map((user, index) => (
                    <span key={`${user.id}-${index}`}>
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
