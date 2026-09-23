const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getAnalyticsOverview(season = "") {
    const query = new URLSearchParams();

    if (season) {
        query.append("season", season);
    }

    const queryString = query.toString();

    const response = await fetch(
        `${API_BASE_URL}/analytics/overview${queryString ? `?${queryString}` : ""
        }`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch analytics overview"
        );
    }

    return response.json();
}

export async function getTopTransfers(season = "") {
    const query = new URLSearchParams();

    if (season) {
        query.append("season", season);
    }

    const queryString = query.toString();

    const response = await fetch(
        `${API_BASE_URL}/analytics/top-transfers${queryString ? `?${queryString}` : ""
        }`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch top transfers"
        );
    }

    return response.json();
}

export async function getActiveClubs(season = "") {
    const query = new URLSearchParams();

    if (season) {
        query.append("season", season);
    }

    const queryString = query.toString();

    const response = await fetch(
        `${API_BASE_URL}/analytics/active-clubs${queryString ? `?${queryString}` : ""
        }`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch active clubs"
        );
    }

    return response.json();
}

export async function getTransfersPerSeason() {
    const response = await fetch(
        `${API_BASE_URL}/analytics/transfers-per-season`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch transfers per season");
    }

    return response.json();
}

export async function getTransfers(params = {}) {
    const query = new URLSearchParams();

    if (params.player) {
        query.append("player", params.player);
    }

    if (params.season) {
        query.append("season", params.season);
    }

    if (params.club) {
        query.append("club", params.club);
    }

    const queryString = query.toString();

    const response = await fetch(
        `${API_BASE_URL}/transfers${queryString ? `?${queryString}` : ""
        }`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    return response.json();
}

export async function getTransfer(id) {
    const response = await fetch(
        `${API_BASE_URL}/transfers/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch transfer detail"
        );
    }

    return response.json();
}

export async function getSeasons() {
    const response = await fetch(
        `${API_BASE_URL}/seasons`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch seasons");
    }

    return response.json();
}

export async function getClubs() {
    const response = await fetch(
        `${API_BASE_URL}/clubs`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch clubs");
    }

    return response.json();
}

export async function getClub(id) {
    const response = await fetch(
        `${API_BASE_URL}/clubs/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch club detail"
        );
    }

    return response.json();
}

export async function getPlayers(
    params = {}
) {
    const query = new URLSearchParams();

    if (params.search) {
        query.append(
            "search",
            params.search
        );
    }

    if (params.position) {
        query.append(
            "position",
            params.position
        );
    }

    if (params.minAge) {
        query.append(
            "min_age",
            params.minAge
        );
    }

    if (params.maxAge) {
        query.append(
            "max_age",
            params.maxAge
        );
    }

    const queryString = query.toString();

    const response = await fetch(
        `${API_BASE_URL}/players${queryString
            ? `?${queryString}`
            : ""
        }`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch players"
        );
    }

    return response.json();
}

export async function getPlayer(id) {
    const response = await fetch(
        `${API_BASE_URL}/players/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch player detail"
        );
    }

    return response.json();
}

export async function searchPlayers(search) {
    const query = new URLSearchParams();

    if (search) {
        query.append("search", search);
    }

    const response = await fetch(
        `${API_BASE_URL}/players?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to search players"
        );
    }

    return response.json();
}


export async function searchClubs(search) {
    const response = await fetch(
        `${API_BASE_URL}/clubs`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to search clubs"
        );
    }

    const data = await response.json();

    const clubs = data.data ?? [];

    return {
        data: clubs.filter((club) =>
            club.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        ),
    };
}


export async function searchTransfers(search) {
    const query = new URLSearchParams();

    if (search) {
        query.append("player", search);
    }

    const response = await fetch(
        `${API_BASE_URL}/transfers?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to search transfers"
        );
    }

    return response.json();
}