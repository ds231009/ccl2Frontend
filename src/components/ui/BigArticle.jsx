import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./BigArticle.module.css";
import { useState } from "react";
import * as apiServices from "../../services/apiService.js";
import * as apiService from "../../services/apiService.js";

const BigArticleCard = ({ article, detailed = false }) => {
    const navigate = useNavigate();
    const {id} = useParams();

    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.checkAuth();
                console.log(data);
                setUser(data.user);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);


    const handleLike = async () => {
        if (!user || !id) return;

        setLoading(true);
        try {
            if (!toggle) {
                await apiServices.postLike(user.id, id);
                setToggle(true);
            } else {
                await apiServices.deleteLike(user.id, id);
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
            onClick={!detailed ? handleClick : undefined }
            style={{ cursor: detailed ? "default" : "pointer" }}
        >
                <img
                    src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=1280`}
                    alt={article.title}
                />
            </div>

            <div
                className={styles.Header}
                onClick={!detailed ? handleClick : undefined }
                style={{ cursor: detailed ? "default" : "pointer" }}
            >
                <div  className={styles.Title}>
                    <h1>{article.title}</h1>
                    <div className={styles.Underline}></div>
                </div>
                <div onClick={handleLike} className={toggle ? "active" : "passive"}>
                    <svg
                        className={styles.likeSvg}
                        viewBox="0 0 130 130"
                    >
                        <path
                            className={styles.likeIcon}
                            d="M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z"/>
                    </svg>
                </div>
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
