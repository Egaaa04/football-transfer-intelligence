import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getSeasons } from "../services/api";

const SeasonContext = createContext(null);

export function SeasonProvider({ children }) {
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] =
        useState("");

    const [loadingSeasons, setLoadingSeasons] =
        useState(true);

    useEffect(() => {
        async function loadSeasons() {
            try {
                const response = await getSeasons();

                const data = response.data ?? [];

                setSeasons(data);

                if (data.length > 0) {
                    const latestSeason = [...data].sort(
                        (a, b) =>
                            Number(b.year) -
                            Number(a.year)
                    )[0];

                    setSelectedSeason(
                        String(latestSeason.year)
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load seasons:",
                    error
                );
            } finally {
                setLoadingSeasons(false);
            }
        }

        loadSeasons();
    }, []);

    return (
        <SeasonContext.Provider
            value={{
                seasons,
                selectedSeason,
                setSelectedSeason,
                loadingSeasons,
            }}
        >
            {children}
        </SeasonContext.Provider>
    );
}

export function useSeason() {
    const context = useContext(
        SeasonContext
    );

    if (!context) {
        throw new Error(
            "useSeason must be used inside SeasonProvider"
        );
    }

    return context;
}