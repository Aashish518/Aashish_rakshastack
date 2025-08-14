import React, { useEffect, useState } from "react";
import "../styles/savedpg.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FooterComp from "../components/Footer";

const SavedPGs = () => {
    const [savedPGs, setSavedPGs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const navigate = useNavigate();

    // Handle scroll to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        // Simulate loading for better UX
        setTimeout(() => {
            const stored = JSON.parse(localStorage.getItem("savedPGs")) || [];
            setSavedPGs(stored);
            setIsLoading(false);
        }, 800);
    }, []);

    const showToastNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const removePG = (id) => {
        setRemovingId(id);
        setTimeout(() => {
            const updated = savedPGs.filter(pg => pg._id !== id);
            setSavedPGs(updated);
            localStorage.setItem("savedPGs", JSON.stringify(updated));
            setRemovingId(null);
            showToastNotification("PG removed from saved list");
        }, 300);
    };

    return (
        <>
            <Navbar/>
            <div className="savedpg-page">
                <Sidebar/>
                <div className="savedpg-container">
                    {/* Hero Section */}
                    <div className="savedpg-hero">
                        <div className="hero-background">
                            <div className="floating-orb orb-1"></div>
                            <div className="floating-orb orb-2"></div>
                        </div>
                        <div className="hero-content reveal">
                            <h1 className="savedpg-title">💖 Saved PGs</h1>
                            <p className="savedpg-subtitle">Your favorite PG accommodations in one place</p>
                            <div className="stats-bar">
                                <div className="stat-item">
                                    <span className="stat-number">{savedPGs.length}</span>
                                    <span className="stat-label">Saved</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">⭐</span>
                                    <span className="stat-label">Favorites</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="savedpg-content">
                        {isLoading ? (
                            <div className="savedpg-grid">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div className="skeleton-card" key={`skeleton-${i}`}>
                                        <div className="skeleton-img"></div>
                                        <div className="skeleton-body">
                                            <div className="skeleton-line w-80"></div>
                                            <div className="skeleton-line w-60"></div>
                                            <div className="skeleton-line w-40"></div>
                                            <div className="skeleton-actions">
                                                <div className="skeleton-btn"></div>
                                                <div className="skeleton-btn ghost"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : savedPGs.length === 0 ? (
                            <div className="empty-state reveal delay-1">
                                <div className="empty-icon">🏠</div>
                                <h3 className="empty-title">No Saved PGs Yet</h3>
                                <p className="empty-description">
                                    Start exploring and save your favorite PG accommodations to see them here.
                                </p>
                                <button
                                    className="accent-btn gradient"
                                    onClick={() => navigate('/pg-listing')}
                                >
                                    🔍 Explore PGs
                                </button>
                            </div>
                        ) : (
                            <div className="savedpg-grid">
                                {savedPGs.map((pg, index) => (
                                    <div
                                        key={pg._id}
                                        className={`savedpg-card card-animate ${removingId === pg._id ? 'removing' : ''}`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="card-media">
                                            <img
                                                src={pg.images?.[0]?.url || '/placeholder-image.jpg'}
                                                alt={pg.name}
                                                loading="lazy"
                                            />
                                            <div className="card-badges">
                                                <span className="gender-badge">{pg.gender}</span>
                                                <span className="saved-badge">💖</span>
                                            </div>
                                            <div className="card-overlay">
                                                <button
                                                    className="quick-view-btn"
                                                    onClick={() => navigate(`/pg-detail/${pg._id}`)}
                                                >
                                                    👁️ Quick View
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <h3 className="card-title">{pg.name}</h3>
                                            <p className="card-location">📍 {pg.location}</p>
                                            <p className="card-price">₹{pg.price}<span>/month</span></p>

                                            <div className="amenities-preview">
                                                {(Array.isArray(pg.amenities) ? pg.amenities : pg.amenities?.split(',') || [])
                                                    .slice(0, 3)
                                                    .map((amenity, idx) => (
                                                        <span key={idx} className="amenity-tag">
                                                            {amenity.trim()}
                                                        </span>
                                                    ))
                                                }
                                                {(Array.isArray(pg.amenities) ? pg.amenities : pg.amenities?.split(',') || []).length > 3 && (
                                                    <span className="amenity-tag more">
                                                        +{(Array.isArray(pg.amenities) ? pg.amenities : pg.amenities?.split(',') || []).length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button
                                                className="action-btn view-btn"
                                                onClick={() => navigate(`/pg-detail/${pg._id}`)}
                                            >
                                                👁️ View Details
                                            </button>
                                            <button
                                                className="action-btn remove-btn"
                                                onClick={() => removePG(pg._id)}
                                                disabled={removingId === pg._id}
                                            >
                                                {removingId === pg._id ? '⏳' : '🗑️'} Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="toast-notification success">
                    <span className="toast-message">{toastMessage}</span>
                    <button
                        className="toast-close"
                        onClick={() => setShowToast(false)}
                        aria-label="Close notification"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}

            <FooterComp />
        </>
    );
};

export default SavedPGs;
