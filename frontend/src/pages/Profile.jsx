import {
    ArrowLeft,
    Mail,
    Shield,
    UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

function Profile() {
    const navigate = useNavigate();

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-page-title">
                        <span>ACCOUNT</span>

                        <strong>Profile</strong>
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
                                ACCOUNT PROFILE
                            </span>

                            <h1>Your Profile</h1>

                            <p>
                                Manage your account information
                                and profile details.
                            </p>
                        </div>
                    </section>

                    <section className="profile-layout">
                        <div className="panel-modern profile-card-main">
                            <div className="profile-avatar-large">
                                E
                            </div>

                            <h2>Ega</h2>

                            <span className="profile-role">
                                Analyst
                            </span>

                            <p>
                                Football Transfer Intelligence
                                analyst
                            </p>
                        </div>

                        <div className="panel-modern profile-information">
                            <div className="panel-heading">
                                <div>
                                    <span className="eyebrow">
                                        ACCOUNT INFORMATION
                                    </span>

                                    <h2>Profile Details</h2>
                                </div>
                            </div>

                            <div className="profile-info-list">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">
                                        <UserRound size={18} />
                                    </div>

                                    <div>
                                        <span>Name</span>
                                        <strong>Ega</strong>
                                    </div>
                                </div>

                                <div className="profile-info-item">
                                    <div className="profile-info-icon">
                                        <Mail size={18} />
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            ega@example.com
                                        </strong>
                                    </div>
                                </div>

                                <div className="profile-info-item">
                                    <div className="profile-info-icon">
                                        <Shield size={18} />
                                    </div>

                                    <div>
                                        <span>Role</span>
                                        <strong>Analyst</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Profile;