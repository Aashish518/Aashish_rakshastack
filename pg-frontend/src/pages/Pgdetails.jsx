import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../styles/pgDetails.css";
import L from 'leaflet';
import { useParams, useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Pgdetails = () => {
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [pgDetails, setPgDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        const fetchPgDetails = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/pg-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setPgDetails(res.data.pg);
            } catch (error) {
                console.error('Failed to fetch PG details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPgDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="pg-loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">
                    <h2>Loading PG Details...</h2>
                    <p>Please wait while we fetch the information</p>
                </div>
            </div>
        );
    }

    if (!pgDetails) {
        return (
            <div className="pg-no-data-container">
                <div className="no-data-icon">🏠</div>
                <h2 className="no-data-title">PG Not Found</h2>
                <p className="no-data-description">
                    Sorry, we couldn't find the PG details you're looking for.
                </p>
                <button
                    className="back-btn gradient"
                    onClick={() => navigate('/pg-listing')}
                >
                    <span className="btn-icon">←</span>
                    <span className="btn-text">Back to Listings</span>
                </button>
            </div>
        );
    }

    return (
        <div className="pg-details-page">
            {/* Enhanced Background Effects */}
            <div className="page-background">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
                <div className="gradient-mesh"></div>
            </div>

            {/* Sticky Navigation Header */}
            <div className="pg-header reveal">
                <div className="header-content">
                    <button
                        className="back-button modern-btn"
                        onClick={() => navigate('/pg-listing')}
                    >
                        <span className="back-icon">←</span>
                        <span className="back-text">Back to Listings</span>
                    </button>


                </div>
            </div>

            <div className="pg-container">
                {/* Flipkart-style Product Layout */}
                <div className="product-layout reveal delay-1">
                    {/* Left Side - Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">

                            <img
                                src={pgDetails.images[selectedImage]?.url || pgDetails.images[0]?.url}
                                alt="Main PG Image"
                                className="main-product-image"
                            />
                            <div className="image-overlay">
                                <span className="image-counter">
                                    {selectedImage + 1} / {pgDetails.images.length}
                                </span>
                            </div>
                            {/* Image Navigation Arrows */}
                            {pgDetails.images.length > 1 && (
                                <>
                                    <button
                                        className="image-nav prev-image"
                                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : pgDetails.images.length - 1)}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        className="image-nav next-image"
                                        onClick={() => setSelectedImage(selectedImage < pgDetails.images.length - 1 ? selectedImage + 1 : 0)}
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="thumbnail-strip">
                            {pgDetails.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`thumbnail-item ${i === selectedImage ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(i)}
                                >
                                    <img
                                        src={img.url}
                                        alt={`PG Image ${i + 1}`}
                                        className="thumbnail-img"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Essential Details */}
                    <div className="product-details">
                        <div className="product-header">
                            <h1 className="product-title">{pgDetails.name}</h1>
                        </div>

                        <div className="essential-details">
                            {/* Location */}
                            <div className="detail-item">
                                <span className="detail-label">📍 Location</span>
                                <span className="detail-value">{pgDetails.location}</span>
                            </div>

                            {/* Price */}
                            <div className="detail-item">
                                <span className="detail-label">💰 Price</span>
                                <span className="detail-value price-highlight">₹{pgDetails.price}/month</span>
                            </div>

                            {/* Gender */}
                            <div className="detail-item">
                                <span className="detail-label">👥 Gender Preference</span>
                                <span className="detail-value gender-tag">{pgDetails.gender}</span>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="amenities-section">
                            <h3 className="section-subtitle">🌟 Amenities</h3>
                            <div className="amenities-list">
                                {pgDetails.amenities.map((amenity, index) => (
                                    <div key={index} className="amenity-item">
                                        <span className="amenity-check">✓</span>
                                        <span className="amenity-name">{amenity.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Details Section */}
                <div className="user-details-section reveal delay-2">
                    <div className="user-info-card">
                        <div className="card-header">
                            <span className="card-icon">👤</span>
                            <h3 className="card-title">Owner Details</h3>
                        </div>
                        <div className="user-info">
                            <div className="user-detail-item">
                                {console.log("detttp",pgDetails)}
                                <span className="user-label">👤 Owner Name</span>
                                <span className="user-value">{pgDetails.userId?.name || 'Owner Name'}</span>
                            </div>
                            <div className="user-detail-item">
                                <span className="user-label">📧 Email</span>
                                <span className="user-value">{pgDetails.userId?.email || 'owner@example.com'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Map Section */}
                <div className="location-section reveal delay-3">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">📍</span>
                            <span className="title-text">Location & Map View</span>
                        </h2>
                        <div className="location-address">
                            <span className="address-text">{pgDetails.location}</span>
                        </div>
                    </div>

                    <div className="location-content">
                        <div className="map-container-enhanced">
                            <MapContainer
                                center={[pgDetails.latitude, pgDetails.longitude]}
                                zoom={16}
                                className="interactive-map"
                                style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                                scrollWheelZoom={true}
                                zoomControl={true}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                                />
                                <Marker position={[pgDetails.latitude, pgDetails.longitude]}>
                                    <Popup>
                                        <div className="enhanced-popup">
                                            <h4 className="popup-title">{pgDetails.name}</h4>
                                            <p className="popup-address">{pgDetails.location}</p>
                                            <p className="popup-price">₹{pgDetails.price}/month</p>
                                            <div className="popup-actions">
                                                <button 
                                                    className="popup-btn"
                                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pgDetails.latitude},${pgDetails.longitude}`, '_blank')}
                                                >
                                                    Get Directions
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        
                        <div className="map-info">
                            <div className="map-info-header">
                                <h3 className="map-info-title">📍 Location Details</h3>
                            </div>
                            <div className="map-detail-item">
                                <span className="map-label">📍 Exact Location</span>
                                <span className="map-value">{pgDetails.location}</span>
                            </div>
                            <div className="map-detail-item">
                                <span className="map-label">🗺️ Coordinates</span>
                                <span className="map-value">{pgDetails.latitude.toFixed(6)}, {pgDetails.longitude.toFixed(6)}</span>
                            </div>
                            <div className="map-detail-item">
                                <span className="map-label">🏠 Property Name</span>
                                <span className="map-value">{pgDetails.name}</span>
                            </div>
                            <div className="map-actions">
                                <button
                                    className="map-action-btn"
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pgDetails.latitude},${pgDetails.longitude}`, '_blank')}
                                >
                                    <span className="btn-icon">🧭</span>
                                    <span className="btn-text">Get Directions</span>
                                </button>
                                <button
                                    className="map-action-btn secondary"
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${pgDetails.latitude},${pgDetails.longitude}`, '_blank')}
                                >
                                    <span className="btn-icon">🗺️</span>
                                    <span className="btn-text">View on Maps</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pgdetails;
