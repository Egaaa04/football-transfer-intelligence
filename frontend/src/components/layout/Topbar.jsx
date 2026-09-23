import {
    Search,
    CalendarDays,
    Users,
    Shield,
    ArrowLeftRight,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    searchPlayers,
    searchClubs,
    searchTransfers,
} from "../../services/api";

import { useSeason } from "../../context/SeasonContext";

function Topbar() {
    const navigate = useNavigate();

    const {
        seasons,
        selectedSeason,
        setSelectedSeason,
        loadingSeasons,
    } = useSeason();

    const searchRef = useRef(null);

    const [search, setSearch] =
        useState("");

    const [results, setResults] =
        useState({
            players: [],
            clubs: [],
            transfers: [],
        });

    const [searching, setSearching] =
        useState(false);

    const [showResults, setShowResults] =
        useState(false);


    useEffect(() => {
        function handleClickOutside(
            event
        ) {
            if (
                searchRef.current &&
                !searchRef.current.contains(
                    event.target
                )
            ) {
                setShowResults(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);


    useEffect(() => {
        const keyword =
            search.trim();

        if (!keyword) {
            setResults({
                players: [],
                clubs: [],
                transfers: [],
            });

            setSearching(false);
            setShowResults(false);

            return;
        }

        setShowResults(true);
        setSearching(true);

        const timeout =
            setTimeout(
                async () => {
                    try {
                        const [
                            playerResponse,
                            clubResponse,
                            transferResponse,
                        ] =
                            await Promise.all([
                                searchPlayers(
                                    keyword
                                ),
                                searchClubs(
                                    keyword
                                ),
                                searchTransfers(
                                    keyword
                                ),
                            ]);

                        setResults({
                            players:
                                (
                                    playerResponse.data ??
                                    []
                                ).slice(
                                    0,
                                    5
                                ),

                            clubs:
                                (
                                    clubResponse.data ??
                                    []
                                ).slice(
                                    0,
                                    5
                                ),

                            transfers:
                                (
                                    transferResponse.data ??
                                    []
                                ).slice(
                                    0,
                                    5
                                ),
                        });
                    } catch (error) {
                        console.error(
                            error
                        );

                        setResults({
                            players: [],
                            clubs: [],
                            transfers: [],
                        });
                    } finally {
                        setSearching(
                            false
                        );
                    }
                },
                350
            );

        return () =>
            clearTimeout(timeout);
    }, [search]);


    const hasResults =
        results.players.length > 0 ||
        results.clubs.length > 0 ||
        results.transfers.length > 0;


    function handlePlayerClick(
        id
    ) {
        setShowResults(false);
        setSearch("");

        navigate(
            `/players/${id}`
        );
    }


    function handleClubClick(
        id
    ) {
        setShowResults(false);
        setSearch("");

        navigate(
            `/clubs/${id}`
        );
    }


    function handleTransferClick(
        id
    ) {
        setShowResults(false);
        setSearch("");

        navigate(
            `/transfers/${id}`
        );
    }


    return (
        <header className="topbar">

            <div
                className="search-box-wrapper"
                ref={searchRef}
            >
                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search players, clubs..."
                        value={search}
                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        onFocus={() => {
                            if (
                                search.trim()
                            ) {
                                setShowResults(
                                    true
                                );
                            }
                        }}
                    />

                    {search && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>
                    )}
                </div>


                {showResults && (
                    <div className="global-search-results">

                        {searching && (
                            <div className="search-status">
                                <div className="loading-spinner" />

                                <span>
                                    Searching...
                                </span>
                            </div>
                        )}


                        {!searching &&
                            !hasResults && (
                                <div className="search-status">
                                    <Search
                                        size={
                                            17
                                        }
                                    />

                                    <span>
                                        No results
                                        found.
                                    </span>
                                </div>
                            )}


                        {!searching &&
                            results.players
                                .length >
                            0 && (
                                <div className="search-result-section">

                                    <div className="search-result-label">
                                        <Users
                                            size={
                                                13
                                            }
                                        />

                                        PLAYERS
                                    </div>

                                    {results.players.map(
                                        (
                                            player
                                        ) => (
                                            <button
                                                type="button"
                                                className="search-result-item"
                                                key={
                                                    player.id
                                                }
                                                onClick={() =>
                                                    handlePlayerClick(
                                                        player.id
                                                    )
                                                }
                                            >
                                                <div className="search-result-icon player">
                                                    {player.photo_url ? (
                                                        <img
                                                            src={
                                                                player.photo_url
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <Users
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <div className="search-result-content">
                                                    <strong>
                                                        {
                                                            player.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {player.position ||
                                                            "Player"}
                                                    </span>
                                                </div>
                                            </button>
                                        )
                                    )}
                                </div>
                            )}


                        {!searching &&
                            results.clubs
                                .length >
                            0 && (
                                <div className="search-result-section">

                                    <div className="search-result-label">
                                        <Shield
                                            size={
                                                13
                                            }
                                        />

                                        CLUBS
                                    </div>

                                    {results.clubs.map(
                                        (
                                            club
                                        ) => (
                                            <button
                                                type="button"
                                                className="search-result-item"
                                                key={
                                                    club.id
                                                }
                                                onClick={() =>
                                                    handleClubClick(
                                                        club.id
                                                    )
                                                }
                                            >
                                                <div className="search-result-icon club">
                                                    {club.logo_url ? (
                                                        <img
                                                            src={
                                                                club.logo_url
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <Shield
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <div className="search-result-content">
                                                    <strong>
                                                        {
                                                            club.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {club.country ||
                                                            "Club"}
                                                    </span>
                                                </div>
                                            </button>
                                        )
                                    )}
                                </div>
                            )}


                        {!searching &&
                            results.transfers
                                .length >
                            0 && (
                                <div className="search-result-section">

                                    <div className="search-result-label">
                                        <ArrowLeftRight
                                            size={
                                                13
                                            }
                                        />

                                        TRANSFERS
                                    </div>

                                    {results.transfers.map(
                                        (
                                            transfer
                                        ) => (
                                            <button
                                                type="button"
                                                className="search-result-item"
                                                key={
                                                    transfer.id
                                                }
                                                onClick={() =>
                                                    handleTransferClick(
                                                        transfer.id
                                                    )
                                                }
                                            >
                                                <div className="search-result-icon transfer">
                                                    <ArrowLeftRight
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </div>

                                                <div className="search-result-content">
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
                                            </button>
                                        )
                                    )}
                                </div>
                            )}

                    </div>
                )}
            </div>


            <div className="topbar-actions">

                <div className="season-selector">
                    <CalendarDays size={17} />

                    <select
                        value={selectedSeason}
                        onChange={(event) =>
                            setSelectedSeason(event.target.value)
                        }
                        disabled={loadingSeasons}
                    >
                        {loadingSeasons ? (
                            <option value="">
                                Loading...
                            </option>
                        ) : (
                            seasons.map((season) => (
                                <option
                                    key={season.id}
                                    value={season.year}
                                >
                                    {season.year}/{String(
                                        Number(season.year) + 1
                                    ).slice(-2)}
                                </option>
                            ))
                        )}
                    </select>
                </div>



                <div className="topbar-avatar">
                    E
                </div>

            </div>

        </header>
    );
}

export default Topbar;