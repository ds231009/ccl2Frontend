import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiService from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SmallArticle from "./ui/SmallArticle"
import styles from "./Articles.module.css";

function ArticlesList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const player = searchParams.get("player")?.split(",") ?? [];
    const team = searchParams.get("team")?.split(",") ?? [];
    const game = searchParams.get("game")?.split(",") ?? [];

    const [selectedGames, setSelectedGames] = useState(game);
    const [selectedTeams, setSelectedTeams] = useState(team);
    const [selectedPlayers, setSelectedPlayers] = useState(player);

    const [games, setGames] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChange = (setter) => (e) => {
        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
        setter(selected);
    };

    const handleRemove = (value, setter) => {
        setter(prev => prev.filter(item => item !== value));
    };

    const handleReset = () => {
        setSelectedGames([]);
        setSelectedTeams([]);
        setSelectedPlayers([]);
        navigate("/articles/");
    };

    const applyFilters = () => {
        const query = [];

        if (selectedGames.length)
            query.push(`game=${selectedGames.join(",")}`);
        if (selectedTeams.length)
            query.push(`team=${selectedTeams.join(",")}`);
        if (selectedPlayers.length)
            query.push(`player=${selectedPlayers.join(",")}`);

        navigate(`/articles?${query.join("&")}`);
    };

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [gamesData, teamsData, playersData] = await Promise.all([
                    apiService.getGames(),
                    apiService.getTeams(),
                    apiService.getPlayers()
                ]);
                setGames(gamesData);
                setTeams(teamsData);
                setPlayers(playersData);
            } catch (err) {
                console.error("Failed to load filter options", err);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        setLoading(true);
        apiService
            .getArticles({ player, team, game })
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [JSON.stringify(player), JSON.stringify(team), JSON.stringify(game)]);

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Header />
            <main className={styles.Articles}>
                <h1>Articles</h1>
                <div className={styles.Filters}>

                    {/* Games Filter */}
                    <div className={styles.FilterCon}>
                        <select multiple value={selectedGames} onChange={handleChange(setSelectedGames)}>
                            {games.map(game => (
                                <option key={game.id} value={game.title}>{game.title}</option>
                            ))}
                        </select>
                        <div className={styles.ItemCon}>
                            {selectedGames.map((g, i) => (
                                <div key={i} className={styles.ItemBox} onClick={() => handleRemove(g, setSelectedGames)}>
                                    {g} &times;
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Teams Filter */}
                    <div className={styles.FilterCon}>
                        <select multiple value={selectedTeams} onChange={handleChange(setSelectedTeams)}>
                            {teams.map(team => (
                                <option key={team.id} value={team.short_name}>{team.name}</option>
                            ))}
                        </select>
                        <div className={styles.ItemCon}>
                            {selectedTeams.map((t, i) => {
                                const full = teams.find(tm => tm.short_name === t)?.name || t;
                                return (
                                    <div key={i} className={styles.ItemBox} onClick={() => handleRemove(t, setSelectedTeams)}>
                                        {full} &times;
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Players Filter */}
                    <div className={styles.FilterCon}>
                        <select multiple value={selectedPlayers} onChange={handleChange(setSelectedPlayers)}>
                            {players.map(player => (
                                <option key={player.id} value={player.username}>{player.username}</option>
                            ))}
                        </select>
                        <div className={styles.ItemCon}>
                            {selectedPlayers.map((p, i) => (
                                <div key={i} className={styles.ItemBox} onClick={() => handleRemove(p, setSelectedPlayers)}>
                                    {p} &times;
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={applyFilters} className="lightButton">Filter</button>
                    <button onClick={handleReset} className="darkButton">Reset</button>
                </div>

                {/*{articles.length === 0 && <p>No articles found.</p>}*/}

                {articles.map(article => (
                    <SmallArticle key={article.id} article={article} detailed />
                ))}
            </main>
            <Footer />
        </div>
    );
}

export default ArticlesList;
