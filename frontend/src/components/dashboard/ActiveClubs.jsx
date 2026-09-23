import { useNavigate } from "react-router-dom";

function ActiveClubs({ clubs }) {
    const navigate = useNavigate();

    const maxTransfers =
        clubs.length > 0
            ? Math.max(
                  ...clubs.map(
                      (club) =>
                          club.total_transfers
                  )
              )
            : 1;

    function handleClubClick(id) {
        navigate(`/clubs/${id}`);
    }

    return (
        <div className="panel-modern">
            <div className="panel-heading">
                <div>
                    <span className="eyebrow">
                        CLUB ACTIVITY
                    </span>

                    <h2>Most Active Clubs</h2>
                </div>

                <span className="panel-badge">
                    Top 10
                </span>
            </div>

            <div className="club-analytics-list">
                {clubs.length === 0 ? (
                    <div className="empty-state">
                        No club data available.
                    </div>
                ) : (
                    clubs.map((club) => {
                        const percentage =
                            (club.total_transfers /
                                maxTransfers) *
                            100;

                        return (
                            <button
                                type="button"
                                className="club-analytics-row clickable-club-row"
                                key={club.id}
                                onClick={() =>
                                    handleClubClick(
                                        club.id
                                    )
                                }
                            >
                                <div className="club-info">
                                    <div className="club-logo">
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
                                            <span>
                                                {club.name?.charAt(
                                                    0
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            {club.name}
                                        </strong>

                                        <span>
                                            {
                                                club.incoming_transfers
                                            }{" "}
                                            in ·{" "}
                                            {
                                                club.outgoing_transfers
                                            }{" "}
                                            out
                                        </span>
                                    </div>
                                </div>

                                <div className="club-stat">
                                    <strong>
                                        {
                                            club.total_transfers
                                        }
                                    </strong>

                                    <div className="progress">
                                        <div
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ActiveClubs;