import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import '../styles/pgdetails.css';

const Pgdetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pgDetails, setPgDetails] = useState({});
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPgDetails = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/pg-listings/${id}`);
                setPgDetails(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPgDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading PG details...</p>
            </div>
        );
    }

    if (!pgDetails || !pgDetails.images) {
        return (
            <div className="error-container">
                <h2>PG not found</h2>
                <button onClick={() => navigate('/pg-listing')}>Back to Listings</button>
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

                {/* Map Section */}
                <div className="map-section reveal delay-3">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">🗺️</span>
                            <span className="title-text">Location</span>
                        </h2>
                    </div>

                    <div className="map-container">
                        <MapContainer
                            center={[pgDetails.latitude, pgDetails.longitude]}
                            zoom={15}
                            className="pg-map"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker position={[pgDetails.latitude, pgDetails.longitude]}>
                                <Popup>
                                    <div className="map-popup">
                                        <h4>{pgDetails.name}</h4>
                                        <p>{pgDetails.location}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pgdetails;
