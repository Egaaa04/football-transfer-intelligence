import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function SeasonChart({ data }) {
    return (
        <div className="panel-modern chart-panel">
            <div className="panel-heading">
                <div>
                    <span className="eyebrow">
                        MARKET ACTIVITY
                    </span>

                    <h2>Transfers per Season</h2>
                </div>

                <span className="panel-badge">
                    Historical
                </span>
            </div>

            <div className="chart-container">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart data={data}>
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
                                    stopOpacity={0.28}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e8edf3"
                        />

                        <XAxis
                            dataKey="season"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#8b95a7",
                                fontSize: 12,
                            }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#8b95a7",
                                fontSize: 12,
                            }}
                        />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="total_transfers"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fill="url(#transferGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SeasonChart;