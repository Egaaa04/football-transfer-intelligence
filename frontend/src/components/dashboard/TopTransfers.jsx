import { useNavigate } from "react-router-dom";

function TopTransfers({ transfers }) {
    const navigate = useNavigate();

    function handleTransferClick(id) {
        navigate(`/transfers/${id}`);
    }

    return (
        <div className="panel-modern">
            <div className="panel-heading">
                <div>
                    <span className="eyebrow">
                        TRANSFER MARKET
                    </span>

                    <h2>Top Transfers</h2>
                </div>

                <span className="panel-badge">
                    Top 10
                </span>
            </div>

            <div className="top-transfer-list">
                {transfers.length === 0 ? (
                    <div className="empty-state">
                        No transfer data available.
                    </div>
                ) : (
                    transfers.map(
                        (transfer, index) => (
                            <button
                                type="button"
                                className="top-transfer-row clickable-transfer-row"
                                key={transfer.id}
                                onClick={() =>
                                    handleTransferClick(
                                        transfer.id
                                    )
                                }
                            >
                                <span className="rank">
                                    {String(
                                        index + 1
                                    ).padStart(2, "0")}
                                </span>

                                <div className="top-transfer-player-avatar">
                                    {transfer.player
                                        ?.photo_url ? (
                                        <img
                                            src={
                                                transfer
                                                    .player
                                                    .photo_url
                                            }
                                            alt={
                                                transfer
                                                    .player
                                                    ?.name ??
                                                "Player"
                                            }
                                        />
                                    ) : (
                                        <span>
                                            {transfer.player?.name?.charAt(
                                                0
                                            ) ?? "?"}
                                        </span>
                                    )}
                                </div>

                                <div className="transfer-main">
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
                                                ?.name ??
                                            "Unknown"
                                        }

                                        {" → "}

                                        {
                                            transfer
                                                .to_club
                                                ?.name ??
                                            "Unknown"
                                        }
                                    </span>
                                </div>

                                <strong className="fee">
                                    €
                                    {Number(
                                        transfer.transfer_fee
                                    ).toLocaleString()}
                                </strong>
                            </button>
                        )
                    )
                )}
            </div>
        </div>
    );
}

export default TopTransfers;