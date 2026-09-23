import { useEffect, useState } from "react";
import {
    ArrowRight,
    Building2,
    RefreshCw,
    Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { getClubs } from "../services/api";

function Clubs() {
    const navigate = useNavigate();

    const [clubs, setClubs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadClubs() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getClubs();

            setClubs(
                response.data ?? []
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load club data."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadClubs();
    }, []);

    const filteredClubs =
        clubs.filter((club) =>
            club.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-page-title">
                        <span>
                            CLUB DATABASE
                        </span>

                        <strong>
                            Club Intelligence
                        </strong>
                    </div>

                    <div className="topbar-actions">
                        <button
                            className="icon-button"
                            onClick={
                                loadClubs
                            }
                            title="Refresh"
                        >
                            <RefreshCw
                                size={18}
                            />
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
                                CLUB DATABASE
                            </span>

                            <h1>
                                Explore the clubs
                                <br />
                                <span>
                                    behind the market.
                                </span>
                            </h1>

                            <p>
                                Explore clubs tracked
                                across the transfer
                                database and inspect
                                their market activity.
                            </p>
                        </div>

                        <div className="transfer-count-card">
                            <div className="transfer-count-icon">
                                <Building2
                                    size={20}
                                />
                            </div>

                            <div>
                                <span>
                                    Total clubs
                                </span>

                                <strong>
                                    {clubs.length}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="transfer-toolbar">
                        <form
                            className="transfer-search"
                            onSubmit={(event) =>
                                event.preventDefault()
                            }
                        >
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search club..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target
                                            .value
                                    )
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>
                            )}
                        </form>
                    </section>

                    <section className="transfer-panel">
                        <div className="transfer-panel-header">
                            <div>
                                <span className="eyebrow">
                                    CLUB ACTIVITY
                                </span>

                                <h2>
                                    Clubs
                                </h2>
                            </div>

                            <span className="panel-badge">
                                {
                                    filteredClubs.length
                                }{" "}
                                records
                            </span>
                        </div>

                        {loading && (
                            <div className="table-state">
                                <div className="loading-spinner" />

                                <span>
                                    Loading club
                                    data...
                                </span>
                            </div>
                        )}

                        {!loading &&
                            error && (
                                <div className="table-state error-state">
                                    <span>
                                        {error}
                                    </span>

                                    <button
                                        className="retry-button"
                                        onClick={
                                            loadClubs
                                        }
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                        {!loading &&
                            !error &&
                            filteredClubs.length ===
                            0 && (
                                <div className="table-state">
                                    <span>
                                        No clubs found.
                                    </span>
                                </div>
                            )}

                        {!loading &&
                            !error &&
                            filteredClubs.length >
                            0 && (
                                <div className="club-grid">
                                    {filteredClubs.map(
                                        (club) => (
                                            <div
                                                className="club-card"
                                                key={
                                                    club.id
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/clubs/${club.id}`
                                                    )
                                                }
                                            >
                                                <div className="club-card-top">
                                                    <div className="club-card-logo">
                                                        {club.logo_url ? (
                                                            <img
                                                                src={
                                                                    club.logo_url
                                                                }
                                                                alt={
                                                                    club.name
                                                                }
                                                            />
                                                        ) : (
                                                            club.name?.charAt(
                                                                0
                                                            ) ??
                                                            "?"
                                                        )}
                                                    </div>

                                                    <div className="club-card-arrow">
                                                        <ArrowRight
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="club-card-info">
                                                    <span>
                                                        CLUB
                                                    </span>

                                                    <h3>
                                                        {
                                                            club.name
                                                        }
                                                    </h3>

                                                    <p>
                                                        {club.country ||
                                                            "Country unknown"}
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

export default Clubs;