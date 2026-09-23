import {
    LayoutDashboard,
    ArrowLeftRight,
    Users,
    Shield,
    Settings,
    Database,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-mark">
                    <Database size={19} />
                </div>

                <div>
                    <strong>FTI</strong>
                    <span>Intelligence</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-label">
                        WORKSPACE
                    </span>

                    <NavLink
                        to="/"
                        className="nav-item"
                    >
                        <LayoutDashboard size={18} />
                        <span>Overview</span>
                    </NavLink>

                    <NavLink
                        to="/transfers"
                        className="nav-item"
                    >
                        <ArrowLeftRight size={18} />
                        <span>Transfers</span>
                    </NavLink>

                    <NavLink
                        to="/players"
                        className="nav-item"
                    >
                        <Users size={18} />
                        <span>Players</span>
                    </NavLink>

                    <NavLink
                        to="/clubs"
                        className="nav-item"
                    >
                        <Shield size={18} />
                        <span>Clubs</span>
                    </NavLink>
                </div>
            </nav>

            <div className="sidebar-bottom">
                <NavLink
                    to="/settings"
                    className="nav-item"
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className="profile-mini"
                >
                    <div className="avatar">
                        E
                    </div>

                    <div>
                        <strong>Ega</strong>
                        <span>Analyst</span>
                    </div>
                </NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;