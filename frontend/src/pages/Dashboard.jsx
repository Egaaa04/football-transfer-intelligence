import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    ArrowLeftRight,
    Users,
    Shield,
    Euro,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import StatCard from "../components/dashboard/StatCard";
import SeasonChart from "../components/dashboard/SeasonChart";
import TopTransfer from "../components/dashboard/TopTransfer";
import ActiveClubs from "../components/dashboard/ActiveClubs";
import TopTransfers from "../components/dashboard/TopTransfers";

import {
    getAnalyticsOverview,
    getTopTransfers,
    getActiveClubs,
    getTransfersPerSeason,
} from "../services/api";

import { useSeason } from "../context/SeasonContext";

function Dashboard() {

    const navigate = useNavigate();
    
    const {
        selectedSeason,
        loadingSeasons,
    } = useSeason();

    const [overview, setOverview] = useState(null);
    const [topTransfers, setTopTransfers] = useState([]);
    const [activeClubs, setActiveClubs] = useState([]);
    const [transfersPerSeason, setTransfersPerSeason] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);

                const [
                    overviewResponse,
                    topTransfersResponse,
                    activeClubsResponse,
                    seasonResponse,
                ] = await Promise.all([
                    getAnalyticsOverview(selectedSeason),
                    getTopTransfers(selectedSeason),
                    getActiveClubs(selectedSeason),
                    getTransfersPerSeason(),
                ]);

                setOverview(
                    overviewResponse.data
                );

                setTopTransfers(
                    topTransfersResponse.data
                );

                setActiveClubs(
                    activeClubsResponse.data
                );

                setTransfersPerSeason(
                    seasonResponse.data
                );
            } catch (err) {
                console.error(err);
                setError(
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [selectedSeason]);

    if (loading || loadingSeasons) {
        return (
            <div className="app-loading">
                <div className="loading-spinner" />
                <span>
                    Loading transfer intelligence...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-loading error-state">
                {error}
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <Topbar />

                <div className="content-wrapper">
                    <section className="hero">
                        <div>
                            <span className="eyebrow">
                                FOOTBALL TRANSFER INTELLIGENCE
                            </span>

                            <h1>
                                Transfer market,
                                <br />
                                <span>
                                    decoded.
                                </span>
                            </h1>

                            <p>
                                Explore player movements,
                                club activity and transfer
                                values through data-driven
                                insights.
                            </p>
                        </div>

                        <div className="hero-season">
                            <span>Current dataset</span>

                            <strong>
                                {selectedSeason
                                    ? `${selectedSeason} / ${String(
                                        Number(selectedSeason) + 1
                                    ).slice(-2)}`
                                    : "Loading..."}
                            </strong>
                        </div>
                    </section>

                    <section className="stats-grid-modern">
                        <StatCard
                            label="Total Transfers"
                            value={
                                overview.total_transfers
                            }
                            description="Tracked movements"
                            icon={ArrowLeftRight}
                            accent
                        />

                        <StatCard
                            label="Players"
                            value={
                                overview.total_players
                            }
                            description="Players in dataset"
                            icon={Users}
                        />

                        <StatCard
                            label="Clubs"
                            value={
                                overview.total_clubs
                            }
                            description="Tracked clubs"
                            icon={Shield}
                        />

                        <StatCard
                            label="Transfer Fees"
                            value={`€${Number(
                                overview.total_transfer_fees
                            ).toLocaleString()}`}
                            description="Known transfer values"
                            icon={Euro}
                        />
                    </section>

                    <section className="analytics-grid-main">
                        <SeasonChart
                            data={
                                transfersPerSeason
                            }
                        />

                        <TopTransfer
                            transfer={
                                overview.highest_transfer
                            }
                        />
                    </section>

                    <section className="analytics-grid-main">
                        <ActiveClubs
                            clubs={activeClubs}
                        />

                        <TopTransfers
                            transfers={
                                topTransfers
                            }
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;