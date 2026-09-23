import { useTheme } from "../context/ThemeContext";

import {
    ArrowLeft,
    Database,
    Monitor,
    Moon,
    Sun,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

function Settings() {
    const navigate = useNavigate();

    const { theme, setTheme } = useTheme();

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-page-title">
                        <span>APPLICATION</span>

                        <strong>Settings</strong>
                    </div>

                    <div className="topbar-actions">
                        <div className="topbar-avatar">
                            E
                        </div>
                    </div>
                </header>

                <div className="content-wrapper">
                    <button
                        className="detail-back-button"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={16} />
                        Back to Overview
                    </button>

                    <section className="page-intro">
                        <div>
                            <span className="eyebrow">
                                SYSTEM CONFIGURATION
                            </span>

                            <h1>Settings</h1>

                            <p>
                                Configure how Football Transfer
                                Intelligence is displayed.
                            </p>
                        </div>
                    </section>

                    <section className="settings-list">
                        <div className="panel-modern settings-card">
                            <div className="settings-card-icon">
                                <Monitor size={19} />
                            </div>

                            <div className="settings-card-content">
                                <strong>Appearance</strong>

                                <span>
                                    Choose how the application
                                    should appear.
                                </span>
                            </div>

                            <div className="settings-theme-options">
                                <button
                                    type="button"
                                    className={`settings-theme-option ${theme === "light"
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setTheme("light")
                                    }
                                >
                                    <Sun size={16} />
                                    Light
                                </button>

                                <button
                                    type="button"
                                    className={`settings-theme-option ${theme === "dark"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        setTheme("dark")
                                    }
                                >
                                    <Moon size={16} />
                                    Dark
                                </button>
                            </div>
                        </div>

                        <div className="panel-modern settings-card">
                            <div className="settings-card-icon">
                                <Database size={19} />
                            </div>

                            <div className="settings-card-content">
                                <strong>Data Source</strong>

                                <span>
                                    Transfer data is provided
                                    through the Football API
                                    integration.
                                </span>
                            </div>

                            <span className="settings-status">
                                Connected
                            </span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Settings;