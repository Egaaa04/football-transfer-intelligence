import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { SeasonProvider } from "./context/SeasonContext";
import { ThemeProvider } from "./context/ThemeContext";

import Dashboard from "./pages/Dashboard";
import Transfers from "./pages/Transfers";
import TransferDetail from "./pages/TransferDetail";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SeasonProvider>
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/transfers"
              element={<Transfers />}
            />

            <Route
              path="/transfers/:id"
              element={<TransferDetail />}
            />

            <Route
              path="/players"
              element={<Players />}
            />

            <Route
              path="/players/:id"
              element={<PlayerDetail />}
            />

            <Route
              path="/clubs"
              element={<Clubs />}
            />

            <Route
              path="/clubs/:id"
              element={
                <ClubDetail />
              }
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </SeasonProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;