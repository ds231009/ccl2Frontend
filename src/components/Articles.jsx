import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as apiService from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SmallArticle from "./ui/SmallArticle";
import Dropdown from "./ui/Dropdown.jsx";
import styles from "./Articles.module.css";

function ArticlesList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialPlayer = searchParams.get("player")?.split(",") ?? [];
    const initialTeam = searchParams.get("team")?.split(",") ?? [];
    const initialGame = searchParams.get("game")?.split(",") ?? [];

    const [selectedPlayers, setSelectedPlayers] = useState(initialPlayer);
    const [selectedTeams, setSelectedTeams] = useState(initialTeam);
    const [selectedGames, setSelectedGames] = useState(initialGame);

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [games, setGames] = useState([]);

    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use useCallback to memoize the fetch function
    const fetchArticles = useCallback(async (currentPage = 1, reset = false) => {
        console.log("fetchArticles");
        setLoading(true);
        setError(null);

        try {
            const data = await apiService.getArticles({
                player: selectedPlayers,
                team: selectedTeams,
                game: selectedGames,
                page: currentPage,
            });

            console.log(data)

            setArticles(prev => reset ? data : [...prev, ...data]);
            setHasMore(data ?? data.length > 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [selectedPlayers, selectedTeams, selectedGames]);

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

    const handleReset = () => {
        console.log("handleReset");
        setSelectedPlayers([]);
        setSelectedTeams([]);
        setSelectedGames([]);
        setPage(1);
        setArticles([]);
        navigate("/articles");
    };

    const applyFilters = () => {
        console.log("applyFilters");
        const query = [];
        if (selectedGames.length) query.push(`game=${selectedGames.join(",")}`);
        if (selectedTeams.length) query.push(`team=${selectedTeams.join(",")}`);
        if (selectedPlayers.length) query.push(`player=${selectedPlayers.join(",")}`);

        navigate(`/articles?${query.join("&")}`);
        setPage(1);
        setArticles([]); // Clear existing articles
    };

    const handleLoadMore = () => {
        console.log("handleLoadMore");
        const nextPage = page + 1;
        setPage(nextPage);
        fetchArticles(nextPage, false);
    };

    // Load filter options on mount
    useEffect(() => {
        const fetchFilters = async () => {
            console.log("fetchFilters");
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

    // Only fetch articles when filters change or on initial load
    useEffect(() => {
        setPage(1);
        fetchArticles(1, true);
    }, [fetchArticles]);

    return (
        <div>
            <Header />
            <main className={styles.Articles}>
                <h1>Articles</h1>
                <div className={styles.Filters}>
                    <Dropdown
                        label="Games"
                        options={games}
                        selected={selectedGames}
                        onAdd={val => handleAddFilter(val, setSelectedGames, selectedGames)}
                        onRemove={val => handleRemoveFilter(val, setSelectedGames)}
                        labelKey="title"
                        valueKey="title"
                    />
                    <Dropdown
                        label="Teams"
                        options={teams}
                        selected={selectedTeams}
                        onAdd={val => handleAddFilter(val, setSelectedTeams, selectedTeams)}
                        onRemove={val => handleRemoveFilter(val, setSelectedTeams)}
                        labelKey="name"
                        valueKey="short_name"
                    />
                    <Dropdown
                        label="Players"
                        options={players}
                        selected={selectedPlayers}
                        onAdd={val => handleAddFilter(val, setSelectedPlayers, selectedPlayers)}
                        onRemove={val => handleRemoveFilter(val, setSelectedPlayers)}
                        labelKey="username"
                        valueKey="username"
                    />
                    <div className={styles.buttons}>
                        {/*<button onClick={applyFilters} className="lightButton">Filter</button>*/}
                        <button onClick={handleReset} className="darkButton">Reset</button>
                    </div>
                </div>
                {articles.map(article => (
                    <SmallArticle key={article.id} article={article} detailed />
                ))}
                {hasMore && !loading && (
                    <button onClick={handleLoadMore}>Load More</button>
                )}
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
            </main>
            <Footer />
        </div>
    );
}

export default ArticlesList;