import { useEffect, useState } from "react";
import {
    ArrowRight,
    Search,
    Users,
    RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { getPlayers } from "../services/api";

function Players() {
    const navigate = useNavigate();

    const [players, setPlayers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [selectedPosition, setSelectedPosition] =
        useState("");

    const [minAge, setMinAge] =
        useState("");

    const [maxAge, setMaxAge] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [filterLoading, setFilterLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function loadPlayers(
        filters = {}
    ) {
        try {
            setFilterLoading(true);
            setError("");

            const response = await getPlayers({
                search:
                    filters.search ??
                    search,

                position:
                    filters.position ??
                    selectedPosition,

                minAge:
                    filters.minAge ??
                    minAge,

                maxAge:
                    filters.maxAge ??
                    maxAge,
            });

            setPlayers(
                response.data ?? []
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load player data."
            );
        } finally {
            setLoading(false);
            setFilterLoading(false);
        }
    }

    useEffect(() => {
        loadPlayers();
    }, []);

    function handleSearch(event) {
        event.preventDefault();

        loadPlayers({
            search,
        });
    }

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-page-title">
                        <span>
                            PLAYER DATABASE
                        </span>

                        <strong>
                            Player Intelligence
                        </strong>
                    </div>

                    <div className="topbar-actions">
                        <button
                            className="icon-button"
                            onClick={() =>
                                loadPlayers()
                            }
                            title="Refresh"
                        >
                            <RefreshCw size={18} />
                        </button>

                        <div className="topbar-avatar">
                            E
                        </div>
                    </div>
                </header>

                <div className="content-wrapper">
                    <section className="page-hero">
                        <div>
                            <span className="eyebrow">
                                PLAYER DATABASE
                            </span>

                            <h1>
                                Know the players
                                <br />
                                <span>
                                    behind the moves.
                                </span>
                            </h1>

                            <p>
                                Explore players
                                tracked across the
                                transfer database and
                                inspect their movement
                                history.
                            </p>
                        </div>

                        <div className="transfer-count-card">
                            <div className="transfer-count-icon">
                                <Users size={20} />
                            </div>

                            <div>
                                <span>
                                    Total players
                                </span>

                                <strong>
                                    {players.length}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="transfer-toolbar">
                        <form
                            className="transfer-search"
                            onSubmit={handleSearch}
                        >
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search player..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={() => {
                                        setSearch("");

                                        loadPlayers({
                                            search: "",
                                        });
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </form>

                        <select
                            className="players-filter-select"
                            value={selectedPosition}
                            onChange={(event) =>
                                setSelectedPosition(event.target.value)
                            }
                        >
                            <option value="">
                                All positions
                            </option>

                            <option value="Goalkeeper">
                                Goalkeeper
                            </option>

                            <option value="Defender">
                                Defender
                            </option>

                            <option value="Midfielder">
                                Midfielder
                            </option>

                            <option value="Attacker">
                                Attacker
                            </option>
                        </select>

                        <input
                            className="age-filter-input"
                            type="number"
                            min="15"
                            max="60"
                            placeholder="Min age"
                            value={minAge}
                            onChange={(event) =>
                                setMinAge(event.target.value)
                            }
                        />

                        <input
                            className="age-filter-input"
                            type="number"
                            min="15"
                            max="60"
                            placeholder="Max age"
                            value={maxAge}
                            onChange={(event) =>
                                setMaxAge(event.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="apply-filter-button"
                            onClick={() => {
                                loadPlayers({
                                    search,
                                    position: selectedPosition,
                                    minAge,
                                    maxAge,
                                });
                            }}
                        >
                            Apply
                        </button>

                        {(search ||
                            selectedPosition ||
                            minAge ||
                            maxAge) && (
                                <button
                                    className="reset-filter-button"
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setSelectedPosition("");
                                        setMinAge("");
                                        setMaxAge("");

                                        loadPlayers({
                                            search: "",
                                            position: "",
                                            minAge: "",
                                            maxAge: "",
                                        });
                                    }}
                                >
                                    Reset
                                </button>
                            )}
                    </section>

                    <section className="transfer-panel">
                        <div className="transfer-panel-header">
                            <div>
                                <span className="eyebrow">
                                    PLAYER ACTIVITY
                                </span>

                                <h2>
                                    Players
                                </h2>
                            </div>

                            <span className="panel-badge">
                                {players.length}{" "}
                                records
                            </span>
                        </div>

                        {loading && (
                            <div className="table-state">
                                <div className="loading-spinner" />

                                <span>
                                    Loading player
                                    data...
                                </span>
                            </div>
                        )}

                        {!loading &&
                            filterLoading && (
                                <div className="table-filter-loading">
                                    <div className="loading-spinner" />

                                    <span>
                                        Updating player
                                        data...
                                    </span>
                                </div>
                            )}

                        {!loading &&
                            !filterLoading &&
                            error && (
                                <div className="table-state error-state">
                                    <span>
                                        {error}
                                    </span>

                                    <button
                                        className="retry-button"
                                        onClick={() =>
                                            loadPlayers()
                                        }
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                        {!loading &&
                            !filterLoading &&
                            !error &&
                            players.length ===
                            0 && (
                                <div className="table-state">
                                    <span>
                                        No players
                                        found.
                                    </span>
                                </div>
                            )}

                        {!loading &&
                            !filterLoading &&
                            !error &&
                            players.length >
                            0 && (
                                <div className="player-grid">
                                    {players.map(
                                        (
                                            player
                                        ) => (
                                            <div
                                                className="player-card"
                                                key={
                                                    player.id
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/players/${player.id}`
                                                    )
                                                }
                                            >
                                                <div className="player-card-top">
                                                    <div className="player-card-avatar">
                                                        {player.photo_url ? (
                                                            <img
                                                                src={
                                                                    player.photo_url
                                                                }
                                                                alt={
                                                                    player.name
                                                                }
                                                            />
                                                        ) : (
                                                            player.name?.charAt(
                                                                0
                                                            ) ??
                                                            "?"
                                                        )}
                                                    </div>

                                                    <div className="player-card-arrow">
                                                        <ArrowRight
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="player-card-info">
                                                    <span>
                                                        {player.position ??
                                                            "Player"}
                                                    </span>

                                                    <h3>
                                                        {
                                                            player.name
                                                        }
                                                    </h3>

                                                    <p>
                                                        {player.age
                                                            ? `${player.age} years old`
                                                            : "Age unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Players;