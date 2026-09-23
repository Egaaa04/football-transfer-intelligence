import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeftRight,
    ArrowRight,
    Search,
    RefreshCw,
} from "lucide-react";

import {
    getTransfers,
    getSeasons,
    getClubs,
} from "../services/api";

import Sidebar from "../components/layout/Sidebar";

function Transfers() {
    const navigate = useNavigate();

    const [transfers, setTransfers] = useState([]);

    const [seasons, setSeasons] = useState([]);
    const [clubs, setClubs] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedSeason, setSelectedSeason] =
        useState("");
    const [selectedClub, setSelectedClub] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] =
        useState(false);
    const [error, setError] = useState("");

    async function loadTransfers(filters = {}) {
        try {
            setFilterLoading(true);
            setError("");

            const response = await getTransfers({
                player: filters.player ?? search,
                season: filters.season ?? undefined,
                league: filters.league ?? undefined,
                club: filters.club ?? undefined,
            });

            console.log("TRANSFER DATA:", response.data);

            setTransfers(response.data ?? []);
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load transfer data."
            );
        } finally {
            setLoading(false);
            setFilterLoading(false);
        }
    }

    useEffect(() => {
        async function loadFilters() {
            try {
                const [
                    seasonResponse,
                    clubResponse,
                ] = await Promise.all([
                    getSeasons(),
                    getClubs(),
                ]);

                setSeasons(
                    seasonResponse.data ?? []
                );

                setClubs(
                    clubResponse.data ?? []
                );
            } catch (err) {
                console.error(
                    "Failed to load filters:",
                    err
                );
            }
        }

        loadFilters();
        loadTransfers();
    }, []);


    function formatFee(fee) {
        if (
            fee === null ||
            fee === undefined
        ) {
            return "Undisclosed";
        }

        const value = Number(fee);

        if (value >= 1_000_000) {
            return `€${(
                value / 1_000_000
            ).toLocaleString("en-US", {
                maximumFractionDigits: 1,
            })}M`;
        }

        if (value >= 1_000) {
            return `€${(
                value / 1_000
            ).toLocaleString("en-US", {
                maximumFractionDigits: 1,
            })}K`;
        }

        return `€${value.toLocaleString(
            "en-US"
        )}`;
    }

    function formatDate(date) {
        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-page-title">
                        <span>
                            TRANSFER MARKET
                        </span>

                        <strong>
                            Transfer Intelligence
                        </strong>
                    </div>

                    <div className="topbar-actions">
                        <button
                            className="icon-button"
                            onClick={() =>
                                loadTransfers()
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
                                TRANSFER DATABASE
                            </span>

                            <h1>
                                Player movements,
                                <br />
                                <span>
                                    in one place.
                                </span>
                            </h1>

                            <p>
                                Explore transfer
                                activity, player
                                movements and
                                recorded transfer
                                values.
                            </p>
                        </div>

                        <div className="transfer-count-card">
                            <div className="transfer-count-icon">
                                <ArrowLeftRight
                                    size={20}
                                />
                            </div>

                            <div>
                                <span>
                                    Total records
                                </span>

                                <strong>
                                    {
                                        transfers.length
                                    }
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="transfer-toolbar">
                        <form
                            className="transfer-search"
                            onSubmit={(event) => {
                                event.preventDefault();

                                loadTransfers({
                                    player: search,
                                });
                            }}
                        >
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search player..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={() => {
                                        setSearch("");

                                        loadTransfers({
                                            player: "",
                                        });
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </form>

                        <select
                            className="transfer-select"
                            value={selectedSeason}
                            onChange={(event) => {
                                const value = event.target.value;

                                setSelectedSeason(value);

                                loadTransfers({
                                    season: value,
                                });
                            }}
                        >
                            <option value="">
                                All seasons
                            </option>

                            {seasons.map((season) => (
                                <option
                                    key={season.id}
                                    value={season.year}
                                >
                                    {season.year}/
                                    {String(
                                        Number(season.year) + 1
                                    ).slice(-2)}
                                </option>
                            ))}
                        </select>

                        <select
                            className="transfer-select"
                            value={selectedClub}
                            onChange={(event) => {
                                const value = event.target.value;

                                setSelectedClub(value);

                                loadTransfers({
                                    club: value,
                                });
                            }}
                        >
                            <option value="">
                                All clubs
                            </option>

                            {clubs.map((club) => (
                                <option
                                    key={club.id}
                                    value={club.external_id}
                                >
                                    {club.name}
                                </option>
                            ))}
                        </select>

                        {(search ||
                            selectedSeason ||
                            selectedClub) && (
                                <button
                                    className="reset-filter-button"
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setSelectedSeason("");
                                        setSelectedClub("");

                                        loadTransfers({
                                            player: "",
                                            season: "",
                                            club: "",
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
                                    MARKET ACTIVITY
                                </span>

                                <h2>
                                    Transfer History
                                </h2>
                            </div>

                            <span className="panel-badge">
                                {transfers.length}{" "}
                                records
                            </span>
                        </div>

                        {loading && (
                            <div className="table-state">
                                <div className="loading-spinner" />

                                <span>
                                    Loading transfer
                                    data...
                                </span>
                            </div>
                        )}

                        {!loading && filterLoading && (
                            <div className="table-filter-loading">
                                <div className="loading-spinner" />

                                <span>
                                    Updating transfer data...
                                </span>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="table-state error-state">
                                <span>
                                    {error}
                                </span>

                                <button
                                    className="retry-button"
                                    onClick={() =>
                                        loadTransfers(
                                            search
                                        )
                                    }
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            transfers.length ===
                            0 && (
                                <div className="table-state">
                                    <span>
                                        No transfer
                                        records found.
                                    </span>
                                </div>
                            )}

                        {!loading &&
                            !filterLoading &&
                            !error &&
                            transfers.length > 0 && (
                                <div className="transfer-table-wrapper">
                                    <table className="transfer-table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    PLAYER
                                                </th>

                                                <th>
                                                    FROM
                                                </th>

                                                <th>
                                                    TO
                                                </th>

                                                <th>
                                                    DATE
                                                </th>

                                                <th>
                                                    TYPE
                                                </th>

                                                <th className="fee-column">
                                                    FEE
                                                </th>

                                                <th />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {transfers.map(
                                                (
                                                    transfer
                                                ) => (
                                                    <tr
                                                        key={transfer.id}
                                                        className="transfer-row-clickable"
                                                        onClick={() =>
                                                            navigate(
                                                                `/transfers/${transfer.id}`
                                                            )
                                                        }
                                                    >
                                                        <td>
                                                            <div className="player-cell">
                                                                <div className="player-table-avatar">
                                                                    {transfer.player?.photo_url ? (
                                                                        <img
                                                                            src={transfer.player.photo_url}
                                                                            alt={transfer.player.name}
                                                                        />
                                                                    ) : (
                                                                        transfer.player?.name?.charAt(0) ?? "?"
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            transfer
                                                                                .player
                                                                                ?.name
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        {transfer
                                                                            .player
                                                                            ?.position ??
                                                                            "Player"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div className="club-cell">
                                                                <div className="club-table-logo">
                                                                    {transfer.from_club?.logo_url ? (
                                                                        <img
                                                                            src={transfer.from_club.logo_url}
                                                                            alt={transfer.from_club.name}
                                                                        />
                                                                    ) : (
                                                                        transfer.from_club?.name?.charAt(0) ??
                                                                        "?"
                                                                    )}
                                                                </div>

                                                                <span>
                                                                    {transfer.from_club?.name ?? "Unknown"}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div className="club-cell">
                                                                <ArrowRight size={15} />

                                                                <div className="club-table-logo">
                                                                    {transfer.to_club?.logo_url ? (
                                                                        <img
                                                                            src={transfer.to_club.logo_url}
                                                                            alt={transfer.to_club.name}
                                                                        />
                                                                    ) : (
                                                                        transfer.to_club?.name?.charAt(0) ??
                                                                        "?"
                                                                    )}
                                                                </div>

                                                                <span>
                                                                    {transfer.to_club?.name ?? "Unknown"}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className="date-cell">
                                                                {formatDate(
                                                                    transfer.transfer_date
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className="type-badge">
                                                                {transfer.fee_raw ??
                                                                    "N/A"}
                                                            </span>
                                                        </td>

                                                        <td className="fee-column">
                                                            <strong className="fee-value">
                                                                {formatFee(
                                                                    transfer.transfer_fee
                                                                )}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            <button className="row-arrow">
                                                                <ArrowRight
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Transfers;