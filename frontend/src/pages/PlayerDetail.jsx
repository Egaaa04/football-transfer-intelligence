import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Euro,
    UserRound,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { getPlayer } from "../services/api";

function PlayerDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [player, setPlayer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadPlayer() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getPlayer(id);

            setPlayer(
                response.data ?? null
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load player detail."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPlayer();
    }, [id]);

    function formatFee(
        transfer
    ) {
        if (
            transfer.transfer_fee !==
                null &&
            transfer.transfer_fee !==
                undefined
        ) {
            return `€${Number(
                transfer.transfer_fee
            ).toLocaleString(
                "en-US"
            )}M`;
        }

        if (transfer.fee_raw) {
            return transfer.fee_raw;
        }

        return "Undisclosed";
    }

    function formatDate(
        date
    ) {
        if (!date) {
            return "Unknown date";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    if (loading) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <div className="detail-loading">
                        <div className="loading-spinner" />

                        <span>
                            Loading player
                            detail...
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <div className="detail-error">
                        <span>
                            {error ||
                                "Player not found."}
                        </span>

                        <button
                            className="retry-button"
                            onClick={
                                loadPlayer
                            }
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const transfers =
        player.transfers ?? [];

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
                            Player Detail
                        </strong>
                    </div>

                    <div className="topbar-actions">
                        <div className="topbar-avatar">
                            E
                        </div>
                    </div>
                </header>

                <div className="content-wrapper">
                    <button
                        className="detail-back-button"
                        onClick={() =>
                            navigate(
                                "/players"
                            )
                        }
                    >
                        <ArrowLeft
                            size={16}
                        />

                        Back to Players
                    </button>

                    <section className="player-detail-hero">
                        <div className="player-detail-main">
                            <div className="player-detail-avatar">
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
                                    <UserRound
                                        size={38}
                                    />
                                )}
                            </div>

                            <div className="player-detail-info">
                                <span className="eyebrow">
                                    PLAYER PROFILE
                                </span>

                                <h1>
                                    {
                                        player.name
                                    }
                                </h1>

                                <p>
                                    {player.position ||
                                        "Position unknown"}

                                    {" • "}

                                    {player.age
                                        ? `${player.age} years old`
                                        : "Age unknown"}
                                </p>
                            </div>
                        </div>

                        <div className="player-detail-stat">
                            <span>
                                Transfers
                            </span>

                            <strong>
                                {
                                    transfers.length
                                }
                            </strong>
                        </div>
                    </section>

                    <section className="transfer-panel">
                        <div className="transfer-panel-header">
                            <div>
                                <span className="eyebrow">
                                    PLAYER ACTIVITY
                                </span>

                                <h2>
                                    Transfer History
                                </h2>
                            </div>

                            <span className="panel-badge">
                                {
                                    transfers.length
                                }{" "}
                                records
                            </span>
                        </div>

                        {transfers.length ===
                            0 ? (
                            <div className="table-state">
                                <span>
                                    No transfer
                                    history found.
                                </span>
                            </div>
                        ) : (
                            <div className="player-transfer-list">
                                {transfers.map(
                                    (
                                        transfer
                                    ) => (
                                        <div
                                            className="player-transfer-card"
                                            key={
                                                transfer.id
                                            }
                                        >
                                            <div className="player-transfer-date">
                                                <CalendarDays
                                                    size={
                                                        16
                                                    }
                                                />

                                                <span>
                                                    {formatDate(
                                                        transfer.transfer_date
                                                    )}
                                                </span>
                                            </div>

                                            <div className="player-transfer-route">
                                                <div className="player-transfer-club">
                                                    <div className="route-logo">
                                                        {transfer
                                                            .from_club
                                                            ?.logo_url ? (
                                                            <img
                                                                src={
                                                                    transfer
                                                                        .from_club
                                                                        .logo_url
                                                                }
                                                                alt={
                                                                    transfer
                                                                        .from_club
                                                                        .name
                                                                }
                                                            />
                                                        ) : (
                                                            transfer
                                                                .from_club
                                                                ?.name
                                                                ?.charAt(
                                                                    0
                                                                ) ||
                                                            "?"
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span>
                                                            FROM
                                                        </span>

                                                        <strong>
                                                            {transfer
                                                                .from_club
                                                                ?.name ||
                                                                "Unknown club"}
                                                        </strong>
                                                    </div>
                                                </div>

                                                <div className="player-transfer-arrow">
                                                    <ArrowRight
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </div>

                                                <div className="player-transfer-club">
                                                    <div className="route-logo">
                                                        {transfer
                                                            .to_club
                                                            ?.logo_url ? (
                                                            <img
                                                                src={
                                                                    transfer
                                                                        .to_club
                                                                        .logo_url
                                                                }
                                                                alt={
                                                                    transfer
                                                                        .to_club
                                                                        .name
                                                                }
                                                            />
                                                        ) : (
                                                            transfer
                                                                .to_club
                                                                ?.name
                                                                ?.charAt(
                                                                    0
                                                                ) ||
                                                            "?"
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span>
                                                            TO
                                                        </span>

                                                        <strong>
                                                            {transfer
                                                                .to_club
                                                                ?.name ||
                                                                "Unknown club"}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="player-transfer-fee">
                                                <Euro
                                                    size={
                                                        16
                                                    }
                                                />

                                                <strong>
                                                    {formatFee(
                                                        transfer
                                                    )}
                                                </strong>
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

export default PlayerDetail;