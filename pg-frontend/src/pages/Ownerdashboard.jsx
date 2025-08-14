import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/ownerdashboad.css";
import { useNavigate } from "react-router-dom";

const Ownerdashboard = () => {
    const token = localStorage.getItem("authToken");
    const [pgs, setPgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [mode, setMode] = useState("add");
    const [editingPgId, setEditingPgId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        latitude: "",
        longitude: "",
        price: "",
        amenities: "",
        gender: "unisex",
        images: [],
    });

    console.log("mmmmm",formData.amenities)

    const navigate = useNavigate();

    useEffect(() => {
        fetchPgs();
    }, []);

    const fetchPgs = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/my-pgs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPgs(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newFiles]
        }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "images") {
                    formData.images.forEach((imageFile) => {
                        formDataToSend.append("images", imageFile);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (mode === "add") {
                await axios.post(`${import.meta.env.VITE_BACK_URL}/add-pg`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showToastNotification("✅ PG added successfully!", "success");
            } else if (mode === "update" && editingPgId) {
                await axios.put(`${import.meta.env.VITE_BACK_URL}/update-pg/${editingPgId}`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showToastNotification("✅ PG updated successfully!", "success");
            }

            // Success animation before closing
            setTimeout(() => {
                handleClosePopup();
                fetchPgs();
            }, 500);

        } catch (error) {
            console.error(error);
            showToastNotification("❌ Something went wrong. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACK_URL}/delete-pg/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Deleted successfully");
            fetchPgs();
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Delete failed");
        }
    };

    const handleUpdateClick = (pg) => {
        setMode("update");
        setEditingPgId(pg._id);
        setFormData({
            name: pg.name,
            location: pg.location,
            latitude: pg.latitude,
            longitude: pg.longitude,
            price: pg.price,
            amenities: pg.amenities,
            gender: pg.gender,
            images: []
        });
        setShowPopup(true);
        setIsClosing(false);
    };

    const showToastNotification = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleClosePopup = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowPopup(false);
            setIsClosing(false);
        }, 300);
    };

    const handleAddClick = () => {
        setMode("add");
        setEditingPgId(null);
        setFormData({
            name: "",
            location: "",
            latitude: "",
            longitude: "",
            price: "",
            amenities: "",
            gender: "unisex",
            images: []
        });
        setShowPopup(true);
        setIsClosing(false);
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setFormData((prev) => ({
                    ...prev,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                }));
            },
        });
        return formData.latitude && formData.longitude ? (
            <Marker position={[formData.latitude, formData.longitude]} />
        ) : null;
    };

    const AMENITIES_LIST = [
        "WiFi",
        "AC",
        "Parking",
        "Laundry",
        "Kitchen",
        "Security",
        "Housekeeping",
        "CCTV",
        "Power Backup",
        "RO Water",
        "Hot Water",
        "Furnished",
        "Att-Bath",
        "TV",
        "Refrigerator",
        "Study Table",
        "Wardrobe",
        "Gym",
        "Balcony",
        "Visitors Allowed"
    ];



    return (
        <>
            <Navbar />
            <div className="ownerdashboard-page">
                <Sidebar />
                <div className="ownerdashboard-container">
                    {/* Hero Section */}
                    <div className="ownerdashboard-hero">
                        <div className="hero-background">
                            <div className="floating-orb orb-1"></div>
                            <div className="floating-orb orb-2"></div>
                            <div className="floating-orb orb-3"></div>
                        </div>
                        <div className="hero-content reveal">
                            <div className="hero-icon">🏢</div>
                            <h1 className="ownerdashboard-title">Owner Dashboard</h1>
                            <p className="ownerdashboard-subtitle">Manage your PG listings, track performance, and grow your business</p>

                            {/* Stats Overview */}
                            <div className="stats-overview">
                                <div className="stat-card">
                                    <div className="stat-icon">🏠</div>
                                    <div className="stat-content">
                                        <span className="stat-number">{pgs.length}</span>
                                        <span className="stat-label">Total PGs</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📈</div>
                                    <div className="stat-content">
                                        <span className="stat-number">{pgs.filter(pg => pg.status !== 'inactive').length}</span>
                                        <span className="stat-label">Active</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-content">
                                        <span className="stat-number">₹{pgs.reduce((sum, pg) => sum + (pg.price || 0), 0).toLocaleString()}</span>
                                        <span className="stat-label">Total Value</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="hero-actions">
                                <button className="action-btn primary" onClick={handleAddClick}>
                                    ✨ Add New PG
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="ownerdashboard-content">
                        <div className="content-header reveal delay-1">
                            <h2 className="section-title">📋 Your PG Listings</h2>
                            <p className="section-description">Manage and monitor all your property listings</p>
                        </div>

                        <section className="ownerdashboard-card-list">
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                  <div className="skeleton-card" key={`s-${i}`}>
                                      <div className="skeleton-img" />
                                      <div className="skeleton-body">
                                          <div className="skeleton-line w-80" />
                                          <div className="skeleton-line w-60" />
                                          <div className="skeleton-actions">
                                              <span className="skeleton-btn" />
                                              <span className="skeleton-btn ghost" />
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : pgs.length === 0 ? (
                                <div className="empty-state reveal delay-2">
                                    <div className="empty-icon">🏠</div>
                                    <h3 className="empty-title">No PGs Listed Yet</h3>
                                    <p className="empty-description">
                                        Start building your PG business by adding your first property listing.
                                    </p>
                                    <button className="action-btn primary" onClick={handleAddClick}>
                                        ✨ Add Your First PG
                                    </button>
                                </div>
                            ) : (
                                pgs.map((pg, index) => (
                                    <div
                                        className="ownerdashboard-card card-animate"
                                        style={{ animationDelay: `${0.1 * index}s` }}
                                        key={pg._id}
                                    >
                                        <div className="card-media">
                                            <img
                                                src={pg.images?.[0]?.url || '/placeholder-image.jpg'}
                                                alt={pg.name}
                                                loading="lazy"
                                            />
                                            <div className="card-badges">
                                                <span className="gender-badge">{pg.gender}</span>
                                                <span className="status-badge active">Active</span>
                                            </div>
                                            <div className="card-overlay">
                                                <button
                                                    className="quick-action-btn"
                                                    onClick={() => navigate(`/pg-detail/${pg._id}`)}
                                                >
                                                    👁️ Quick View
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <h3 className="card-title" title={pg.name}>{pg.name}</h3>
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
                                                        +{(Array.isArray(pg.amenities) ? pg.amenities : pg.amenities?.split(',') || []).length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button
                                                className="card-btn view-btn"
                                                onClick={() => navigate(`/pg-detail/${pg._id}`)}
                                            >
                                                👁️ View
                                            </button>
                                            <button
                                                className="card-btn edit-btn"
                                                onClick={() => handleUpdateClick(pg)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="card-btn delete-btn"
                                                onClick={() => handleDelete(pg._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                    </section>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div
                    className={`ownerdashboard-popup ${isClosing ? 'closing' : ''}`}
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.target === e.currentTarget && handleClosePopup()}
                >
                    <div className={`ownerdashboard-popup-content ${isClosing ? 'closing' : ''}`}>
                        <div className="popup-header">
                            <h2 className="popup-title">
                                {mode === "add" ? "✨ Add New PG" : "🔄 Update PG"}
                            </h2>
                            <button
                                className="popup-close-btn"
                                type="button"
                                onClick={handleClosePopup}
                                aria-label="Close popup"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder=" "
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="floating-input"
                                    />
                                    <label className="floating-label">🏠 PG Name</label>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder=" "
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="floating-input"
                                    />
                                    <label className="floating-label">📍 Location</label>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="latitude"
                                        placeholder=" "
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        required
                                        className="floating-input"
                                        step="any"
                                    />
                                    <label className="floating-label">🌐 Latitude</label>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="longitude"
                                        placeholder=" "
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        required
                                        className="floating-input"
                                        step="any"
                                    />
                                    <label className="floating-label">🌐 Longitude</label>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder=" "
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="floating-input"
                                    />
                                    <label className="floating-label">💰 Price (₹)</label>
                                </div>

                                <div className="input-group select-group">
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="floating-select">
                                        <option value="boy">👦 Boys Only</option>
                                        <option value="girl">👧 Girls Only</option>
                                        <option value="unisex">👥 Unisex</option>
                                    </select>
                                    <label className="floating-label">👤 Gender Preference</label>
                                </div>

                                <div className="amenities-section">
                                    <h3 className="section-title">🏆 Amenities</h3>
                                    <div className="amenities-group">
                                        {AMENITIES_LIST.map((amenity, index) => {
                                            const currentAmenities = formData.amenities
                                                ? Array.isArray(formData.amenities)
                                                    ? formData.amenities
                                                    : formData.amenities.split(',').map(a => a.trim()).filter(a => a)
                                                : [];

                                            const checked = currentAmenities.includes(amenity);
                                            const icons = {
                                                "WiFi": "📶",
                                                "AC": "❄️",
                                                "Parking": "🚗",
                                                "Laundry": "👕",
                                                "Kitchen": "🍳",
                                                "Security": "🔒",
                                                "Housekeeping": "🧹",
                                                "CCTV": "📹",
                                                "Power Backup": "🔋",
                                                "RO Water": "💧",
                                                "Hot Water": "🚿",
                                                "Furnished": "🛋️",
                                                "Att-Bath": "🚽",
                                                "TV": "📺",
                                                "Refrigerator": "🧊",
                                                "Study Table": "📚",
                                                "Wardrobe": "👔",
                                                "Gym": "🏋️",
                                                "Balcony": "🌇",
                                                "Visitors Allowed": "👥"
                                            };


                                            return (
                                                <label
                                                    key={index}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={amenity}
                                                        checked={checked}
                                                        onChange={(e) => {
                                                            const { value, checked } = e.target;
                                                            let updatedAmenities = [...currentAmenities];

                                                            if (checked) {
                                                                if (!updatedAmenities.includes(value)) {
                                                                    updatedAmenities.push(value);
                                                                }
                                                            } else {
                                                                updatedAmenities = updatedAmenities.filter((a) => a !== value);
                                                            }

                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                amenities: updatedAmenities.join(",")
                                                            }));
                                                        }}
                                                    />
                                                    <span className="amenity-icon">{icons[amenity]}</span>
                                                    <span className="amenity-text">{amenity}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>


                                <div className="ownerdashboard-form-group file-input">
                                    <label>📸 Upload PG Images</label>
                                    <div className="file-upload-area">
                                        <input type="file" name="images" multiple onChange={handleImageChange} id="file-upload" />
                                        <div className="file-upload-text">
                                            <span className="upload-icon">☁️</span>
                                            <span>Click to upload or drag and drop</span>
                                            <small>PNG, JPG up to 10MB each</small>
                                        </div>
                                    </div>
                                    {formData.images.length > 0 && (
                                        <div className="uploaded-files">
                                            {formData.images.map((file, index) => (
                                                <div key={index} className="uploaded-file">
                                                    <span className="file-icon">📄</span>
                                                    <span className="file-name">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="map-section">
                                <h3 className="section-title">🗺️ Location on Map</h3>
                                <p className="map-instruction">Click on the map to set the exact location</p>
                                <div className="ownerdashboard-map">
                                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "250px", width: "100%" }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="ownerdashboard-popup-buttons">
                                <button
                                    className="od-btn ghost"
                                    type="button"
                                    onClick={handleClosePopup}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`od-btn gradient ${isSubmitting ? 'loading' : ''}`}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Processing..."
                                        : mode === "add"
                                            ? "✨ Create PG"
                                            : "🔄 Update PG"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className={`toast-notification ${toastType}`}>
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
        </>
    );
};


export default Ownerdashboard;
