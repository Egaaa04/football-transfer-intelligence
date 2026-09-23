import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeftRight,
    Users,
    Shield,
    Euro,
    RefreshCw,
    TrendingUp,
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";

import {
    getAnalyticsOverview,
    getTopTransfers,
    getActiveClubs,
    getTransfersPerSeason,
} from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";


function formatMoney(value) {
    if (value === null || value === undefined) {
        return "—";
    }

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "—";
    }

    if (amount >= 1000000000) {
        return `€${(amount / 1000000000).toFixed(1)}B`;
    }

    if (amount >= 1000000) {
        return `€${(amount / 1000000).toFixed(1)}M`;
    }

    if (amount >= 1000) {
        return `€${(amount / 1000).toFixed(1)}K`;
    }

    return `€${amount.toFixed(0)}`;
}


function formatFee(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Free";
    }

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return value;
    }

    return formatMoney(amount);
}


function Analytics() {
    const [overview, setOverview] = useState(null);
    const [topTransfers, setTopTransfers] = useState([]);
    const [activeClubs, setActiveClubs] = useState([]);
    const [transfersPerSeason, setTransfersPerSeason] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadAnalytics() {
        try {
            setLoading(true);
            setError("");

            const [
                overviewResponse,
                topTransfersResponse,
                activeClubsResponse,
                seasonResponse,
            ] = await Promise.all([
                getAnalyticsOverview(),
                getTopTransfers(),
                getActiveClubs(),
                getTransfersPerSeason(),
            ]);

            setOverview(
                overviewResponse.data ?? null
            );

            setTopTransfers(
                topTransfersResponse.data ?? []
            );

            setActiveClubs(
                activeClubsResponse.data ?? []
            );

            setTransfersPerSeason(
                seasonResponse.data ?? []
            );
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load analytics data."
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadAnalytics();
    }, []);


    if (loading) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <Topbar />

                    <div className="page-loading">
                        <div className="loading-spinner" />
                        <span>
                            Loading analytics...
                        </span>
                    </div>
                </main>
            </div>
        );
    }


    if (error) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <Topbar />

                    <div className="page-content">
                        <div className="analytics-error">
                            <strong>
                                Something went wrong
                            </strong>

                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={loadAnalytics}
                            >
                                <RefreshCw size={15} />
                                Try again
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }


    const totalTransfers =
        overview?.total_transfers ?? 0;

    const totalPlayers =
        overview?.total_players ?? 0;

    const totalClubs =
        overview?.total_clubs ?? 0;

    const totalTransferFees =
        overview?.total_transfer_fees ?? 0;


    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <Topbar />

                <div className="page-content analytics-page">

                    <section className="analytics-hero">
                        <div>
                            <div className="eyebrow">
                                MARKET INTELLIGENCE
                            </div>

                            <h1>
                                Transfer analytics,
                                decoded.
                            </h1>

                            <p>
                                Explore transfer activity,
                                spending patterns, and club
                                movement across the dataset.
                            </p>
                        </div>

                        <div className="analytics-hero-icon">
                            <TrendingUp size={30} />
                        </div>
                    </section>


                    <section className="analytics-stats">

                        <div className="analytics-stat-card">
                            <div className="analytics-stat-icon green">
                                <ArrowLeftRight
                                    size={19}
                                />
                            </div>

                            <div>
                                <span>
                                    Total Transfers
                                </span>

                                <strong>
                                    {totalTransfers}
                                </strong>
                            </div>
                        </div>


                        <div className="analytics-stat-card">
                            <div className="analytics-stat-icon blue">
                                <Users size={19} />
                            </div>

                            <div>
                                <span>
                                    Players
                                </span>

                                <strong>
                                    {totalPlayers}
                                </strong>
                            </div>
                        </div>


                        <div className="analytics-stat-card">
                            <div className="analytics-stat-icon purple">
                                <Shield size={19} />
                            </div>

                            <div>
                                <span>
                                    Clubs
                                </span>

                                <strong>
                                    {totalClubs}
                                </strong>
                            </div>
                        </div>


                        <div className="analytics-stat-card">
                            <div className="analytics-stat-icon gold">
                                <Euro size={19} />
                            </div>

                            <div>
                                <span>
                                    Known Transfer Fees
                                </span>

                                <strong>
                                    {formatMoney(
                                        totalTransferFees
                                    )}
                                </strong>
                            </div>
                        </div>

                    </section>


                    <section className="analytics-grid">

                        <div className="analytics-panel analytics-chart-panel">

                            <div className="analytics-panel-header">
                                <div>
                                    <span className="panel-eyebrow">
                                        ACTIVITY
                                    </span>

                                    <h2>
                                        Transfers by season
                                    </h2>
                                </div>

                                <div className="panel-badge">
                                    {transfersPerSeason.length}
                                    {" "}
                                    seasons
                                </div>
                            </div>


                            <div className="analytics-chart">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <AreaChart
                                        data={
                                            transfersPerSeason
                                        }
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -20,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="transferGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.22}
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            stroke="#edf0f2"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="season"
                                            tick={{
                                                fill: "#8b95a7",
                                                fontSize: 11,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            allowDecimals={false}
                                            tick={{
                                                fill: "#8b95a7",
                                                fontSize: 11,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Tooltip
                                            contentStyle={{
                                                border: "1px solid #e7ebee",
                                                borderRadius: "10px",
                                                boxShadow:
                                                    "0 10px 30px rgba(23,32,51,0.08)",
                                                fontSize: "12px",
                                            }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="total_transfers"
                                            name="Transfers"
                                            stroke="#10b981"
                                            strokeWidth={2.5}
                                            fill="url(#transferGradient)"
                                            dot={{
                                                r: 3,
                                                fill: "#ffffff",
                                                stroke: "#10b981",
                                                strokeWidth: 2,
                                            }}
                                            activeDot={{
                                                r: 5,
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                        </div>


                        <div className="analytics-panel">

                            <div className="analytics-panel-header">
                                <div>
                                    <span className="panel-eyebrow">
                                        MARKET
                                    </span>

                                    <h2>
                                        Transfer summary
                                    </h2>
                                </div>
                            </div>


                            <div className="analytics-summary">

                                <div className="summary-row">
                                    <span>
                                        Total fees
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            overview?.total_transfer_fees
                                        )}
                                    </strong>
                                </div>


                                <div className="summary-row">
                                    <span>
                                        Average fee
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            overview?.average_transfer_fee
                                        )}
                                    </strong>
                                </div>


                                <div className="summary-divider" />


                                <div className="summary-highest">
                                    <span>
                                        HIGHEST RECORDED TRANSFER
                                    </span>

                                    <strong>
                                        {overview
                                            ?.highest_transfer
                                            ?.player
                                            ?.name ??
                                            "—"}
                                    </strong>

                                    <div className="highest-route">
                                        <span>
                                            {overview
                                                ?.highest_transfer
                                                ?.from_club
                                                ?.name ??
                                                "Unknown"}
                                        </span>

                                        <ArrowLeftRight
                                            size={13}
                                        />

                                        <span>
                                            {overview
                                                ?.highest_transfer
                                                ?.to_club
                                                ?.name ??
                                                "Unknown"}
                                        </span>
                                    </div>

                                    <b>
                                        {formatMoney(
                                            overview
                                                ?.highest_transfer
                                                ?.transfer_fee
                                        )}
                                    </b>
                                </div>

                            </div>

                        </div>

                    </section>


                    <section className="analytics-grid lower">

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">
                                <div>
                                    <span className="panel-eyebrow">
                                        TOP MOVES
                                    </span>

                                    <h2>
                                        Highest transfer fees
                                    </h2>
                                </div>
                            </div>


                            <div className="analytics-transfer-list">

                                {topTransfers.map(
                                    (
                                        transfer,
                                        index
                                    ) => (
                                        <div
                                            className="analytics-transfer-row"
                                            key={
                                                transfer.id
                                            }
                                        >
                                            <div className="transfer-rank">
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>

                                            <div className="analytics-transfer-player">
                                                <strong>
                                                    {
                                                        transfer
                                                            .player
                                                            ?.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        transfer
                                                            .from_club
                                                            ?.name
                                                    }

                                                    {" → "}

                                                    {
                                                        transfer
                                                            .to_club
                                                            ?.name
                                                    }
                                                </span>
                                            </div>

                                            <div className="analytics-transfer-fee">
                                                {formatFee(
                                                    transfer.transfer_fee
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>


                        <div className="analytics-panel">

                            <div className="analytics-panel-header">
                                <div>
                                    <span className="panel-eyebrow">
                                        CLUB ACTIVITY
                                    </span>

                                    <h2>
                                        Most active clubs
                                    </h2>
                                </div>
                            </div>


                            <div className="active-clubs-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={
                                            activeClubs.slice(
                                                0,
                                                7
                                            )
                                        }
                                        layout="vertical"
                                        margin={{
                                            top: 0,
                                            right: 15,
                                            left: 5,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            stroke="#edf0f2"
                                            horizontal={false}
                                        />

                                        <XAxis
                                            type="number"
                                            allowDecimals={false}
                                            tick={{
                                                fill: "#8b95a7",
                                                fontSize: 10,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={115}
                                            tick={{
                                                fill: "#4b5565",
                                                fontSize: 10,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Tooltip
                                            cursor={{
                                                fill: "#f5f8f7",
                                            }}
                                            contentStyle={{
                                                border: "1px solid #e7ebee",
                                                borderRadius: "10px",
                                                boxShadow:
                                                    "0 10px 30px rgba(23,32,51,0.08)",
                                                fontSize: "11px",
                                            }}
                                        />

                                        <Bar
                                            dataKey="total_transfers"
                                            name="Transfers"
                                            fill="#10b981"
                                            radius={[
                                                0,
                                                6,
                                                6,
                                                0,
                                            ]}
                                            barSize={17}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>

                            </div>

                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
}

export default Analytics;