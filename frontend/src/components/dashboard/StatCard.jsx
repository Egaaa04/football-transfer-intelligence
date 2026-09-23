function StatCard({
    label,
    value,
    description,
    icon: Icon,
    accent = false,
}) {
    return (
        <div
            className={`stat-card-modern ${
                accent ? "accent" : ""
            }`}
        >
            <div className="stat-card-top">
                <div className="stat-icon">
                    <Icon size={18} />
                </div>

                <span className="stat-period">
                    Live data
                </span>
            </div>

            <div className="stat-value">
                {value}
            </div>

            <div className="stat-label">
                {label}
            </div>

            <div className="stat-description">
                {description}
            </div>
        </div>
    );
}

export default StatCard;