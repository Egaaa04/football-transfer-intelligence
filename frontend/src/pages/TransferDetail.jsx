import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CircleDollarSign,
    Database,
    Shield,
    Trophy,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import { getTransfer } from "../services/api";

function TransferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transfer, setTransfer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function loadTransfer() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getTransfer(id);

                setTransfer(response.data);
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to load transfer details."
                );
            } finally {
                setLoading(false);
            }
        }

        loadTransfer();
    }, [id]);

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
            month: "long",
            year: "numeric",
        });
    }

    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner" />

                <span>
                    Loading transfer details...
                </span>
            </div>
        );
    }

    if (error || !transfer) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <div className="content-wrapper">
                        <div className="table-state error-state">
                            <span>
                                {error ||
                                    "Transfer not found."}
                            </span>

                            <button
                                className="retry-button"
                                onClick={() =>
                                    navigate(
                                        "/transfers"
                                    )
                                }
                            >
                                Back to transfers
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const player =
        transfer.player;

    const fromClub =
        transfer.from_club;

    const toClub =
        transfer.to_club;

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
                            Transfer Details
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
                                "/transfers"
                            )
                        }
                    >
                        <ArrowLeft size={16} />

                        <span>
                            Back to transfers
                        </span>
                    </button>

                    <section className="detail-hero">
                        <div className="detail-player">
                            <div className="detail-player-avatar">
                                {player?.photo_url ? (
                                    <img
                                        src={
                                            player.photo_url
                                        }
                                        alt={
                                            player.name
                                        }
                                    />
                                ) : (
                                    player?.name?.charAt(
                                        0
                                    ) ?? "?"
                                )}
                            </div>

                            <div>
                                <span className="eyebrow">
                                    TRANSFER RECORD
                                </span>

                                <h1>
                                    {player?.name ??
                                        "Unknown Player"}
                                </h1>

                                <p>
                                    {player?.position ??
                                        "Player"}
                                    {player?.age
                                        ? ` · ${player.age} years old`
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <span className="detail-type-badge">
                            {transfer.fee_raw ??
                                "N/A"}
                        </span>
                    </section>

                    <section className="transfer-route-card">
                        <div className="route-club">
                            <div className="route-logo">
                                {fromClub?.logo_url ? (
                                    <img
                                        src={
                                            fromClub.logo_url
                                        }
                                        alt={
                                            fromClub.name
                                        }
                                    />
                                ) : (
                                    fromClub?.name?.charAt(
                                        0
                                    ) ?? "?"
                                )}
                            </div>

                            <span className="route-label">
                                FROM
                            </span>

                            <strong>
                                {fromClub?.name ??
                                    "Unknown"}
                            </strong>
                        </div>

                        <div className="route-arrow">
                            <ArrowRight size={22} />
                        </div>

                        <div className="route-club">
                            <div className="route-logo">
                                {toClub?.logo_url ? (
                                    <img
                                        src={
                                            toClub.logo_url
                                        }
                                        alt={
                                            toClub.name
                                        }
                                    />
                                ) : (
                                    toClub?.name?.charAt(
                                        0
                                    ) ?? "?"
                                )}
                            </div>

                            <span className="route-label">
                                TO
                            </span>

                            <strong>
                                {toClub?.name ??
                                    "Unknown"}
                            </strong>
                        </div>
                    </section>

                    <section className="detail-grid">
                        <div className="detail-info-card">
                            <div className="detail-card-icon">
                                <CircleDollarSign
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    Transfer Fee
                                </span>

                                <strong>
                                    {formatFee(
                                        transfer.transfer_fee
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="detail-info-card">
                            <div className="detail-card-icon">
                                <CalendarDays
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    Transfer Date
                                </span>

                                <strong>
                                    {formatDate(
                                        transfer.transfer_date
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="detail-info-card">
                            <div className="detail-card-icon">
                                <Trophy
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    Season
                                </span>

                                <strong>
                                    {transfer.season
                                        ?.year
                                        ? `${transfer.season.year}/${String(
                                              Number(
                                                  transfer
                                                      .season
                                                      .year
                                              ) + 1
                                          ).slice(-2)}`
                                        : "-"}
                                </strong>
                            </div>
                        </div>

                        <div className="detail-info-card">
                            <div className="detail-card-icon">
                                <Shield
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    League
                                </span>

                                <strong>
                                    {transfer
                                        .league
                                        ?.name ??
                                        "Not associated"}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="detail-meta-panel">
                        <div className="transfer-panel-header">
                            <div>
                                <span className="eyebrow">
                                    DATA RECORD
                                </span>

                                <h2>
                                    Transfer Information
                                </h2>
                            </div>

                            <div className="detail-database-icon">
                                <Database
                                    size={18}
                                />
                            </div>
                        </div>

                        <div className="detail-meta-grid">
                            <div>
                                <span>
                                    Player ID
                                </span>

                                <strong>
                                    {player?.external_id ??
                                        "-"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Transfer ID
                                </span>

                                <strong>
                                    {transfer.id}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Transfer Type
                                </span>

                                <strong>
                                    {transfer.fee_raw ??
                                        "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Recorded Fee
                                </span>

                                <strong>
                                    {formatFee(
                                        transfer.transfer_fee
                                    )}
                                </strong>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default TransferDetail;