import React, {useState, useEffect, useCallback} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Footer from "./ui/Footer.jsx";
import Header from "./ui/Header.jsx";
import * as apiService from "../services/apiService";
import styles from "./CreateArticle.module.css";
import Dropdown from "./ui/Dropdown.jsx";

function CreateArticle() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [userId, setUserId] = useState(null);

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
                setAuthors(authorsData.filter(user => user.role === 'journalist' || user.role === 'admin'));
            } catch (err) {
                console.error("Failed to load filter options", err);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.checkAuth();
                const userId = data.user.id;

                setSelectedAuthors(prevAuthors => (
                    prevAuthors.includes(userId) ? prevAuthors : [...prevAuthors, userId]
                ));
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUser();
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
        <>
            <Header siteName={"Publish"} />
            <main>
                <h2>Add Co-Authors or References</h2>
                <div className={styles.Filters}>
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
                </div>
                <form className="InputForm" onSubmit={handleSave} style={{width: "70%"}}>
                    <input
                           placeholder="title"
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           required
                    />
                    <textarea style={{width: "100%", minHeight: "120px"}}
                           placeholder="text"
                           value={text}
                           onChange={(e) => setText(e.target.value)}
                           required
                    />

                    <button className="lightButton" type="submit">Publish</button>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default CreateArticle;