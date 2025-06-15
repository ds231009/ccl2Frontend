import React, {useState, useEffect, useCallback} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Footer from "./ui/Footer.jsx";
import Header from "./ui/Header.jsx";
import * as apiService from "../services/apiService";
import styles from "./Article.module.css";
import Dropdown from "./ui/Dropdown.jsx";

function ArticlePage() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [img_path, setImgPath] = useState("");

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const initialPlayer = searchParams.get("player")?.split(",") ?? [];
    const initialTeam = searchParams.get("team")?.split(",") ?? [];
    const initialGame = searchParams.get("game")?.split(",") ?? [];

    const [selectedPlayers, setSelectedPlayers] = useState(initialPlayer);
    const [selectedTeams, setSelectedTeams] = useState(initialTeam);
    const [selectedGames, setSelectedGames] = useState(initialGame);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [games, setGames] = useState([]);
    const [authors, setAuthors] = useState([]);

    const [error, setError] = useState(null);


    const handleAddFilter = (val, setter, currentList) => {
        console.log("handleAddFilter");
        if (!currentList.includes(val)) {
            setter([...currentList, val]);
        }
    };

    const handleRemoveFilter = (val, setter) => {
        console.log("handleRemoveFilter", val);
        setter(prev => prev.filter(item => item !== val));
    };

    // Load filter options on mount
    useEffect(() => {
        const fetchFilters = async () => {
            console.log("fetchFilters");
            try {
                const [gamesData, teamsData, playersData, authorsData] = await Promise.all([
                    apiService.getGames(),
                    apiService.getTeams(),
                    apiService.getPlayers(),
                    apiService.getUsers()
                ]);
                setGames(gamesData);
                setTeams(teamsData);
                setPlayers(playersData);
                setAuthors(authorsData);
            } catch (err) {
                console.error("Failed to load filter options", err);
            }
        };

        fetchFilters();
    }, []);


    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        const articleData = {
            title: title,
            text: text,
            authors: selectedAuthors,
            players: selectedPlayers,
            teams: selectedTeams,
            games: selectedGames,
        }

        try {
            const data = await apiService.createArticle(articleData);
            console.log(data);

            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="article-container">
            <Header />
            <main>
                <form onSubmit={handleSave}>
                    <Dropdown
                        label="Authors"
                        options={authors}
                        selected={selectedAuthors}
                        onAdd={val => handleAddFilter(val, setSelectedAuthors, selectedAuthors)}
                        onRemove={val => handleRemoveFilter(val, setSelectedAuthors)}
                        labelKey="username"
                        valueKey="id"
                    />
                    <Dropdown
                        label="Games"
                        options={games}
                        selected={selectedGames}
                        onAdd={val => handleAddFilter(val, setSelectedGames, selectedGames)}
                        onRemove={val => handleRemoveFilter(val, setSelectedGames)}
                        labelKey="title"
                        valueKey="id"
                    />
                    <Dropdown
                        label="Teams"
                        options={teams}
                        selected={selectedTeams}
                        onAdd={val => handleAddFilter(val, setSelectedTeams, selectedTeams)}
                        onRemove={val => handleRemoveFilter(val, setSelectedTeams)}
                        labelKey="name"
                        valueKey="id"
                    />
                    <Dropdown
                        label="Players"
                        options={players}
                        selected={selectedPlayers}
                        onAdd={val => handleAddFilter(val, setSelectedPlayers, selectedPlayers)}
                        onRemove={val => handleRemoveFilter(val, setSelectedPlayers)}
                        labelKey="username"
                        valueKey="id"
                    />
                    <input className={styles.Input}
                           placeholder="title"
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           required
                    />
                    <input className={styles.Input}
                           placeholder="text"
                           type="text"
                           value={text}
                           onChange={(e) => setText(e.target.value)}
                           required
                    />
                    <input className={styles.Input}
                           placeholder="img_path"
                           type="text"
                           value={img_path}
                           onChange={(e) => setImgPath(e.target.value)}
                           required
                    />
                    <button  type="submit" className="darkButton"></button>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default ArticlePage;
