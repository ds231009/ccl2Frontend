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
        console.log("LIKE");

        setLoading(true);
        try {
            await apiServices.postLike(user.id, id); // assuming both vars exist
            setToggle(!toggle);
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
            onClick={!detailed ? undefined : handleClick }
            style={{ cursor: detailed ? "pointer" : "default" }}
        >
                <img
                    src={`http://localhost:3000/thumbnail/${article.img_path}.jpg?width=1280`}
                    alt={article.title}
                />
            </div>

            <div  className={styles.Header}>
                <div  className={styles.Title}>
                    <h1>{article.title}</h1>
                    <div className={styles.Underline}></div>
                </div>
                <div onClick={() => {handleLike}}>
                    <span>wesrdtfuijkl</span>
                    <svg width="20px" height="20px" viewBox="0 0 10.704754 9.9075899">
                        <g
                            id="layer1"
                            transform="translate(-14.995372,-50.366699)">
                            <path
                                id="path34"
                                fill={toggle ? "var(--highlight-color-100)" : "#cccccc"}
                                d="m 17.525699,52.371841 v 0.324011 c 0.0665,0.0083 0.164848,0.02655 0.295073,0.05426 0.130224,0.02771 0.231818,0.05822 0.303857,0.09147 0.116369,0.05264 0.189662,0.1123 0.220142,0.1788 0.03048,0.06373 0.04547,0.1452 0.04547,0.244946 v 4.16047 c 0,0.105287 -0.01772,0.192214 -0.05374,0.261483 -0.03602,0.0665 -0.106584,0.122064 -0.211873,0.166398 -0.05541,0.02216 -0.149675,0.04177 -0.28267,0.05839 -0.132996,0.01663 -0.23868,0.02754 -0.31626,0.03307 v 0.324011 h 5.531962 l 0.112138,-1.83658 h -0.303341 c -0.05264,0.138537 -0.161901,0.347508 -0.328145,0.627352 -0.166244,0.277073 -0.316072,0.483317 -0.449068,0.619083 -0.04987,0.05264 -0.125893,0.09322 -0.22841,0.120923 -0.09975,0.02771 -0.208157,0.04816 -0.324528,0.06201 -0.102517,0.01383 -0.221318,0.02201 -0.357084,0.02481 -0.135765,0.0028 -0.252357,0.0047 -0.349333,0.0047 -0.207806,0 -0.372631,-0.0087 -0.494543,-0.02532 -0.119142,-0.01663 -0.213402,-0.05123 -0.28267,-0.10387 -0.07204,-0.05541 -0.121639,-0.13416 -0.149345,-0.236678 -0.02493,-0.105288 -0.03772,-0.246936 -0.03772,-0.424263 v -1.699638 h 0.607198 c 0.163474,0 0.307332,0.0196 0.432015,0.05839 0.124683,0.03602 0.232576,0.103859 0.324011,0.203606 0.06095,0.0665 0.124703,0.188025 0.191203,0.365352 0.06927,0.174556 0.112564,0.320295 0.129191,0.436666 h 0.315743 v -2.46036 h -0.315746 c -0.0194,0.119142 -0.0627,0.25891 -0.129191,0.419612 -0.06373,0.160704 -0.127476,0.273204 -0.191203,0.336931 -0.102518,0.102517 -0.215866,0.171719 -0.340547,0.207739 -0.124684,0.03602 -0.263088,0.05374 -0.415479,0.05374 h -0.607198 v -2.277377 h 0.856278 c 0.09698,0 0.219021,0.0027 0.36587,0.0083 0.14962,0.0028 0.265694,0.01368 0.348816,0.03307 0.193951,0.04156 0.389288,0.17724 0.58601,0.407211 0.196723,0.229971 0.335644,0.457182 0.415996,0.681612 h 0.315743 v -1.50433 z"/>
                        </g>
                    </svg>
                </div>
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
