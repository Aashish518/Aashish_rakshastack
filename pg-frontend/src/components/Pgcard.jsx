import React, { useState } from "react";
import "../styles/pgcard.css";
import { useNavigate } from "react-router-dom";

const PGCard = ({ pg, onViewDetail }) => {
    const token=localStorage.getItem("authToken");
    const navigate=useNavigate();
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const savepg = () => {
        if (!token) {
            showNotification("Please log in to save PG");
            navigate("/login"); 
            return;
        }

        let savedPGs = JSON.parse(localStorage.getItem("savedPGs")) || [];

        if (!savedPGs.some(item => item._id === pg._id)) {
            savedPGs.push(pg);
            localStorage.setItem("savedPGs", JSON.stringify(savedPGs));
            showNotification("PG saved successfully! ✨");
        } else {
            showNotification("PG Alredy saved!");
        }
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'pg-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    };

    const formatAmenities = (amenities) => {
        if (!amenities) return [];
        if (typeof amenities === 'string') {
            return amenities.split(',').map(a => a.trim()).slice(0, 3);
        }
        if (Array.isArray(amenities)) {
            return amenities.slice(0, 3);
        }
        return [];
    };

    const getGenderIcon = (gender) => {
        switch(gender?.toLowerCase()) {
            case 'male': return '👨';
            case 'female': return '👩';
            case 'unisex': return '👥';
            default: return '🏠';
        }
    };

    return (
        <div className="pg-card">
            {/* Card Header with Image */}
            <div className="pg-card-media">
                <div className="image-container">
                    {!isImageLoaded && (
                        <div className="image-skeleton">
                            <div className="skeleton-shimmer"></div>
                        </div>
                    )}
                    <img
                        src={pg.images?.[0]?.url || '/placeholder-pg.jpg'}
                        alt={pg.name}
                        onLoad={() => setIsImageLoaded(true)}
                        style={{ display: isImageLoaded ? 'block' : 'none' }}
                    />
                    
                    <div className="price-badge">
                        <span className="price-amount">₹{pg.price}</span>
                        <span className="price-period">/month</span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="pg-card-body">
                <div className="card-header">
                    <h3 className="card-title">{pg.name}</h3>
                    <div className="gender-badge">
                        <span className="gender-icon">{getGenderIcon(pg.gender)}</span>
                        <span className="gender-text">{pg.gender}</span>
                    </div>
                </div>

                <div className="card-location">
                    <span className="location-icon">📍</span>
                    <span className="location-text">{pg.location}</span>
                </div>

                {/* Amenities Preview */}
                <div className="amenities-preview">
                    {formatAmenities(pg.amenities).map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                            {amenity}
                        </span>
                    ))}
                    {formatAmenities(pg.amenities).length > 3 && (
                        <span className="amenity-more">+{formatAmenities(pg.amenities).length - 3} more</span>
                    )}
                </div>
            </div>

            {/* Card Actions */}
            <div className="pg-card-actions">
                <button
                    className="view-details-btn primary"
                    onClick={() => onViewDetail(pg._id)}
                >
                    <span className="btn-icon">👁️</span>
                    <span className="btn-text">View Details</span>
                </button>
                <button
                    className="contact-btn secondary"
                    onClick={savepg}
                >
                    <span className="btn-icon">❤️</span>
                    <span className="btn-text">Save PG</span>
                </button>
            </div>
        </div>
    );
};

export default PGCard;
