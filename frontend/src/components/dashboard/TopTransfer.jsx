import {
    ArrowUpRight,
    Trophy,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function TopTransfer({ transfer }) {
    const navigate = useNavigate();

    if (!transfer) {
        return (
            <div className="panel-modern">
                No transfer data available.
            </div>
        );
    }

    function handleClick() {
        navigate(
            `/transfers/${transfer.id}`
        );
    }

    return (
        <button
            type="button"
            className="panel-modern featured-transfer clickable-panel"
            onClick={handleClick}
        >
            <div className="panel-heading">
                <div>
                    <span className="eyebrow">
                        BIGGEST DEAL
                    </span>

                    <h2>
                        Highest Transfer
                    </h2>
                </div>

                <div className="trophy-icon">
                    <Trophy size={18} />
                </div>
            </div>

            <div className="transfer-player">
                <div className="player-avatar">
                    {transfer.player?.name?.charAt(0)}
                </div>

                <div>
                    <h3>
                        {transfer.player?.name}
                    </h3>

                    <span>
                        {transfer.season?.year}
                        {" season"}
                    </span>
                </div>
            </div>

            <div className="transfer-route">
                <div>
                    <span>FROM</span>

                    <strong>
                        {transfer.from_club?.name ??
                            "Unknown"}
                    </strong>
                </div>

                <ArrowUpRight size={20} />

                <div>
                    <span>TO</span>

                    <strong>
                        {transfer.to_club?.name ??
                            "Unknown"}
                    </strong>
                </div>
            </div>

            <div className="transfer-fee">
                <span>TRANSFER FEE</span>

                <strong>
                    €
                    {Number(
                        transfer.transfer_fee
                    ).toLocaleString()}
                </strong>
            </div>
        </button>
    );
}

export default TopTransfer;