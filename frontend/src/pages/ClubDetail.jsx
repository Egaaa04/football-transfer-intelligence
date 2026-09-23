import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ArrowDownLeft,
    ArrowUpRight,
    CalendarDays,
    Euro,
    Shield,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { getClub } from "../services/api";

function ClubDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [club, setClub] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadClub() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getClub(id);

            setClub(
                response.data ?? null
            );
        } catch (err) {
            console.error(err);

            setError(
                "Unable to load club detail."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadClub();
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
                            Loading club
                            detail...
                        </span>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !club) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <div className="detail-error">
                        <span>
                            {error ||
                                "Club not found."}
                        </span>

                        <button
                            className="retry-button"
                            onClick={
                                loadClub
                            }
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const outgoingTransfers =
        club.outgoing_transfers ?? [];

    const incomingTransfers =
        club.incoming_transfers ?? [];

    const totalTransfers =
        outgoingTransfers.length +
        incomingTransfers.length;

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
                            Club Detail
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
                                "/clubs"
                            )
                        }
                    >
                        <ArrowLeft
                            size={16}
                        />

                        Back to Clubs
                    </button>

                    <section className="club-detail-hero">
                        <div className="club-detail-main">
                            <div className="club-detail-logo">
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
                                    <Shield
                                        size={
                                            38
                                        }
                                    />
                                )}
                            </div>

                            <div className="club-detail-info">
                                <span className="eyebrow">
                                    CLUB PROFILE
                                </span>

                                <h1>
                                    {
                                        club.name
                                    }
                                </h1>

                                <p>
                                    {club.country ||
                                        "Country not available"}
                                </p>
                            </div>
                        </div>

                        <div className="club-detail-stat">
                            <span>
                                Total activity
                            </span>

                            <strong>
                                {
                                    totalTransfers
                                }
                            </strong>
                        </div>
                    </section>

                    <section className="club-stat-grid">
                        <div className="club-stat-card">
                            <div className="club-stat-icon incoming">
                                <ArrowDownLeft
                                    size={
                                        18
                                    }
                                />
                            </div>

                            <div>
                                <span>
                                    Incoming
                                </span>

                                <strong>
                                    {
                                        incomingTransfers.length
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="club-stat-card">
                            <div className="club-stat-icon outgoing">
                                <ArrowUpRight
                                    size={
                                        18
                                    }
                                />
                            </div>

                            <div>
                                <span>
                                    Outgoing
                                </span>

                                <strong>
                                    {
                                        outgoingTransfers.length
                                    }
                                </strong>
                            </div>
                        </div>
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
                                {
                                    totalTransfers
                                }{" "}
                                records
                            </span>
                        </div>

                        {totalTransfers ===
                            0 ? (
                            <div className="table-state">
                                <span>
                                    No transfer
                                    history found.
                                </span>
                            </div>
                        ) : (
                            <div className="club-transfer-list">
                                {[
                                    ...incomingTransfers.map(
                                        (
                                            transfer
                                        ) => ({
                                            ...transfer,
                                            direction:
                                                "incoming",
                                        })
                                    ),
                                    ...outgoingTransfers.map(
                                        (
                                            transfer
                                        ) => ({
                                            ...transfer,
                                            direction:
                                                "outgoing",
                                        })
                                    ),
                                ]
                                    .sort(
                                        (
                                            a,
                                            b
                                        ) =>
                                            new Date(
                                                b.transfer_date ||
                                                0
                                            ) -
                                            new Date(
                                                a.transfer_date ||
                                                0
                                            )
                                    )
                                    .map(
                                        (
                                            transfer
                                        ) => (
                                            <div
                                                className="club-transfer-card"
                                                key={`${transfer.direction}-${transfer.id}`}
                                            >
                                                <div className="club-transfer-date">
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

                                                <div className="club-transfer-player">
                                                    <span>
                                                        PLAYER
                                                    </span>

                                                    <strong>
                                                        {transfer
                                                            .player
                                                            ?.name ||
                                                            "Unknown player"}
                                                    </strong>
                                                </div>

                                                <div className="club-transfer-route">
                                                    {transfer.direction === "incoming" ? (
                                                        <>
                                                            <div className="club-transfer-club">
                                                                <div className="route-logo">
                                                                    {transfer.from_club?.logo_url ? (
                                                                        <img
                                                                            src={transfer.from_club.logo_url}
                                                                            alt={transfer.from_club.name}
                                                                        />
                                                                    ) : (
                                                                        transfer.from_club?.name?.charAt(0) || "?"
                                                                    )}
                                                                </div>

                                                                <span>
                                                                    {transfer.from_club?.name || "Unknown"}
                                                                </span>
                                                            </div>

                                                            <ArrowRight size={17} />

                                                            <div className="club-transfer-club">
                                                                <div className="route-logo">
                                                                    {club.logo_url ? (
                                                                        <img
                                                                            src={club.logo_url}
                                                                            alt={club.name}
                                                                        />
                                                                    ) : (
                                                                        club.name?.charAt(0) || "?"
                                                                    )}
                                                                </div>

                                                                <span>
                                                                    {club.name}
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="club-transfer-club">
                                                                <div className="route-logo">
                                                                    {club.logo_url ? (
                                                                        <img
                                                                            src={club.logo_url}
                                                                            alt={club.name}
                                                                        />
                                                                    ) : (
                                                                        club.name?.charAt(0) || "?"
                                                                    )}
                                                                </div>

                                                                <span>
                                                                    {club.name}
                                                                </span>
                                                            </div>

                                                            <ArrowRight size={17} />

                                                            <div className="club-transfer-club">
                                                                <div className="route-logo">
                                                                    {transfer.to_club?.logo_url ? (
                                                                        <img
                                                                            src={transfer.to_club.logo_url}
                                                                            alt={transfer.to_club.name}
                                                                        />
                                                                    ) : (
                                                                        transfer.to_club?.name?.charAt(0) || "?"
                                                                    )}
                                                                </div>

                                                                <span>
                                                                    {transfer.to_club?.name || "Unknown"}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="club-transfer-fee">
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

export default ClubDetail;