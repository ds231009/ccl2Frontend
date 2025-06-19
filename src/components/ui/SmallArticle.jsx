import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SmallArticle.module.css";

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
                        <span>{new Intl.DateTimeFormat("de-DE").format(new Date(article.timestamp))}</span>
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
                    <p>{article.text.length > 250 ? article.text.slice(0, 120) + "[...]" : article.text}</p>
                    {detailed && (
                        <div className={styles.Icons}>
                            <svg
                                width="15px"
                                viewBox="0 0 15.318123 13.229167">
                                <path
                                    transform="translate(0.77706,-26.394881)"
                                    className={styles.Icon}
                                    d="m 2.240124,26.394881 c -1.65945674,0 -3.017184,1.357641 -3.017184,3.017185 v 4.641877 c 0,1.375598 0.95112447,2.493004 2.2164717,2.852148 v 2.021931 a 0.69635774,0.69635774 0 0 0 1.1885951,0.492229 l 2.3491245,-2.349124 h 6.5467477 c 1.659543,0 3.017184,-1.357641 3.017184,-3.017184 v -4.641877 c 0,-1.659544 -1.357727,-3.017185 -3.017184,-3.017185 z m 0,1.392491 h 9.283755 c 0.912159,0 1.624693,0.712621 1.624693,1.624694 v 4.641877 c 0,0.912073 -0.712621,1.624693 -1.624693,1.624693 H 4.6887974 a 0.69635774,0.69635774 0 0 0 -0.4922295,0.203896 l -1.364425,1.364666 V 36.372123 A 0.69635774,0.69635774 0 0 0 2.1667212,35.676717 C 1.2930662,35.638284 0.6154306,34.941051 0.6154306,34.053943 v -4.641877 c 0,-0.912073 0.7125339,-1.624694 1.6246934,-1.624694 z m 1.1559717,2.126038 a 0.69628813,0.69628813 0 0 0 -0.696365,0.696366 0.69628813,0.69628813 0 0 0 0.696365,0.696125 H 9.9771464 A 0.69628813,0.69628813 0 0 0 10.673511,30.609776 0.69628813,0.69628813 0 0 0 9.9771464,29.91341 Z m 0,2.246697 a 0.69628813,0.69628813 0 0 0 -0.696365,0.696125 0.69628813,0.69628813 0 0 0 0.696365,0.696366 H 9.9771464 A 0.69628813,0.69628813 0 0 0 10.673511,32.856232 0.69628813,0.69628813 0 0 0 9.9771464,32.160107 Z"/>
                            </svg>
                            <span>
                              {article.comment_count > 0
                                  ? `${article.comment_count} comment${article.comment_count === 1 ? "" : "s"}`
                                  : ""}
                            </span>
                        |
                            <svg
                                width="15px"
                                viewBox="0 0 130 130">
                                <path
                                    className={styles.Icon}
                                    d="M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z"
                                />
                            </svg>
                            <span>
                              {article.likes_count > 0
                                  ? `${article.likes_count} like${article.likes_count === 1 ? "" : "s"}`
                                  : ""}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.SmallLine} />
        </div>
    );
};

export default SmallArticleCard;
