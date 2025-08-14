import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FooterComp from "../components/Footer";

const Profile = () => {
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isClosingModal, setIsClosingModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        handleProfile();
    }, []);

    const showToastNotification = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleCloseModal = () => {
        setIsClosingModal(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosingModal(false);
        }, 300);
    };

    const handleProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}`,}
            });
            console.log(res.data.user);
            setName(res.data.user.name);
            setEmail(res.data.user.email);
        } catch (error) {
            console.error(error);
            showToastNotification("Failed to load profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        showToastNotification("Logged out successfully", "success");
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    const handleUpdateProfile = () => {
        setShowModal(true);
        setIsClosingModal(false);
    };

    const handleSaveUpdate = async () => {
        if (!name.trim()) {
            showToastNotification("Name cannot be empty", "error");
            return;
        }

        try {
            setIsUpdating(true);
            const res = await axios.put(
                `${import.meta.env.VITE_BACK_URL}/update-profile`,
                {
                    name: name.trim()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setName(res.data.name);
            handleCloseModal();
            showToastNotification("Profile updated successfully!", "success");
            handleProfile();
        } catch (error) {
            console.error(error);
            showToastNotification("Failed to update profile", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar/>
                <div className="profile-page">
                    <Sidebar />
                    <div className="profile-container">
                        {/* Hero Section */}
                        <div className="profile-hero">
                            <div className="hero-background">
                                <div className="floating-orb orb-1"></div>
                                <div className="floating-orb orb-2"></div>
                            </div>
                            <div className="hero-content">
                                <div className="profile-avatar skeleton-avatar">
                                    <div className="avatar-shimmer"></div>
                                </div>
                                <h1 className="profile-title">My Profile</h1>
                                <p className="profile-subtitle">Loading your details...</p>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="profile-content">
                            <div className="profile-card skeleton">
                                <div className="skeleton-header">
                                    <div className="skeleton-line w-40"></div>
                                    <div className="skeleton-line w-60"></div>
                                </div>
                                <div className="skeleton-body">
                                    <div className="skeleton-item">
                                        <div className="skeleton-line w-30"></div>
                                        <div className="skeleton-line w-70"></div>
                                    </div>
                                    <div className="skeleton-item">
                                        <div className="skeleton-line w-30"></div>
                                        <div className="skeleton-line w-70"></div>
                                    </div>
                                </div>
                                <div className="skeleton-actions">
                                    <div className="skeleton-btn"></div>
                                    <div className="skeleton-btn ghost"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterComp/>
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <div className="profile-page">
                <Sidebar />
                <div className="profile-container">
                    {/* Hero Section */}
                    <div className="profile-hero">
                        <div className="hero-background">
                            <div className="floating-orb orb-1"></div>
                            <div className="floating-orb orb-2"></div>
                        </div>
                        <div className="hero-content reveal">
                            <div className="profile-avatar">
                                <div className="avatar-circle">
                                    <span className="avatar-text">{name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="avatar-status">
                                    <span className="status-dot"></span>
                                    <span className="status-text">Online</span>
                                </div>
                            </div>
                            <h1 className="profile-title">Welcome back, {name}!</h1>
                            <p className="profile-subtitle">Manage your account settings and preferences</p>
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-icon">👤</span>
                                    <span className="stat-label">Profile</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-icon">💖</span>
                                    <span className="stat-label">Account</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="profile-content">
                        <div className="profile-card reveal delay-1">
                            <div className="card-header">
                                <h2 className="card-title">📋 Personal Information</h2>
                                <p className="card-description">Your account details and contact information</p>
                            </div>

                            <div className="profile-grid">
                                <div className="profile-item">
                                    <div className="item-icon">👤</div>
                                    <div className="item-content">
                                        <span className="item-label">Full Name</span>
                                        <span className="item-value">{name}</span>
                                    </div>
                                </div>
                                <div className="profile-item">
                                    <div className="item-icon">📧</div>
                                    <div className="item-content">
                                        <span className="item-label">Email Address</span>
                                        <span className="item-value">{email}</span>
                                    </div>
                                </div>
                                <div className="profile-item">
                                    <div className="item-icon">🔐</div>
                                    <div className="item-content">
                                        <span className="item-label">Account Status</span>
                                        <span className="item-value status-active">Active</span>
                                    </div>
                                </div>
                                <div className="profile-item">
                                    <div className="item-icon">📅</div>
                                    <div className="item-content">
                                        <span className="item-label">Member Since</span>
                                        <span className="item-value">{new Date().getFullYear()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button className="action-btn primary" onClick={handleUpdateProfile}>
                                    ✏️ Update Profile
                                </button>
                                <button className="action-btn danger" onClick={handleLogout}>
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Enhanced Modal */}
            {showModal && (
                <div
                    className={`modal-overlay ${isClosingModal ? 'closing' : ''}`}
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
                >
                    <div className={`modal-content ${isClosingModal ? 'closing' : ''}`}>
                        <div className="modal-header">
                            <h2 className="modal-title">✏️ Update Profile</h2>
                            <button
                                className="modal-close-btn"
                                onClick={handleCloseModal}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group">
                                <label className="input-label">👤 Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="modal-input"
                                    disabled={isUpdating}
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn secondary"
                                onClick={handleCloseModal}
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                className={`modal-btn primary ${isUpdating ? 'loading' : ''}`}
                                onClick={handleSaveUpdate}
                                disabled={isUpdating}
                            >
                                {isUpdating ? '⏳ Updating...' : '✅ Update Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className={`toast-notification ${toastType}`}>
                    <div className="toast-content">
                        <span className="toast-icon">
                            {toastType === 'success' ? '✅' : toastType === 'error' ? '❌' : 'ℹ️'}
                        </span>
                        <span className="toast-message">{toastMessage}</span>
                    </div>
                    <button
                        className="toast-close"
                        onClick={() => setShowToast(false)}
                        aria-label="Close notification"
                    >
                        ✕
                    </button>
                </div>
            )}
            </div>
            <FooterComp/>
        </>
    );
};

export default Profile;
