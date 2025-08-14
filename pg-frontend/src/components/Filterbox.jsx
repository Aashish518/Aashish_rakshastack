import { useState, useEffect } from "react";
import "../styles/filterbox.css";

const FilterBox = ({ onFilter }) => {
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [gender, setGender] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [filterAnimation, setFilterAnimation] = useState(false);

    // Enhanced entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleAmenityChange = (amenity) => {
        setAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity]
        );
        // Trigger micro-animation for feedback
        setFilterAnimation(true);
        setTimeout(() => setFilterAnimation(false), 300);
    };

    const applyFilters = () => {
        onFilter({ priceRange, gender, amenities });
        // Add success animation
        setFilterAnimation(true);
        setTimeout(() => setFilterAnimation(false), 500);
    };

    const clearFilters = () => {
        setPriceRange({ min: "", max: "" });
        setGender("");
        setAmenities([]);
        onFilter({ priceRange: { min: "", max: "" }, gender: "", amenities: [] });
        // Add clear animation
        setFilterAnimation(true);
        setTimeout(() => setFilterAnimation(false), 400);
    };

    const hasActiveFilters = priceRange.min || priceRange.max || gender || amenities.length > 0;

    const amenityOptions = [
        { name: "WiFi", icon: "📶" },
        { name: "AC", icon: "❄️" },
        { name: "Parking", icon: "🚗" },
        { name: "Laundry", icon: "👕" },
        { name: "Kitchen", icon: "🍳" },
        { name: "Security", icon: "🔒" },
        { name: "Housekeeping", icon: "🧹" },
        { name: "CCTV", icon: "📹" },
        { name: "Power Backup", icon: "🔋" },
        { name: "RO Water", icon: "💧" },
        { name: "Hot Water", icon: "🚿" },
        { name: "Furnished", icon: "🛋️" },
        { name: "Att-Bath", icon: "🚽" },
        { name: "TV", icon: "📺" },
        { name: "Refrigerator", icon: "🧊" },
        { name: "Study Table", icon: "📚" },
        { name: "Wardrobe", icon: "👔" },
        { name: "Gym", icon: "🏋️" },
        { name: "Balcony", icon: "🌇" },
        { name: "Visitors Allowed", icon: "👥" }
    ];


    return (
        <div className={`filter-box ${isVisible ? 'reveal-active' : 'reveal'} ${filterAnimation ? 'filter-pulse' : ''}`}>
            {/* Enhanced Filter Header with Gradient Background */}
            <div className="filter-header">
                <div className="filter-title-section">
                    <div className="title-with-icon">
                        <div className="filter-icon-wrapper">
                            <span className="filter-icon">🔍</span>
                            <div className="icon-glow"></div>
                        </div>
                        <div className="title-content">
                            <h3 className="filter-title">Advanced Filters</h3>
                            <p className="filter-description">Refine your search to find the perfect PG</p>
                        </div>
                    </div>
                </div>
                <div className="filter-toggle-section">
                    <button
                        className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label="Toggle filters"
                    >
                        <span className="toggle-text">{isExpanded ? 'Less' : 'More'}</span>
                        <div className="toggle-icon-wrapper">
                            <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
                            <div className="toggle-ripple"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Enhanced Filter Content with Staggered Animations */}
            <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
                <div className="filter-row">
                    {/* Enhanced Price Range Section */}
                    <div className="filter-section price-section" data-animation-delay="0.1s">
                        <label className="filter-label">
                            <div className="label-icon-wrapper">
                                <span className="label-icon">💰</span>
                                <div className="icon-pulse"></div>
                            </div>
                            <span className="label-text">Price Range</span>
                            <div className="label-underline"></div>
                        </label>
                        <div className="input-group">
                            <div className="input-wrapper enhanced">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="price-input"
                                />
                                <span className="input-suffix">₹</span>
                                <div className="input-focus-line"></div>
                            </div>
                            <div className="range-separator">
                                <span className="separator-text">to</span>
                                <div className="separator-line"></div>
                            </div>
                            <div className="input-wrapper enhanced">
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="price-input"
                                />
                                <span className="input-suffix">₹</span>
                                <div className="input-focus-line"></div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Gender Section */}
                    <div className="filter-section gender-section" data-animation-delay="0.2s">
                        <label className="filter-label">
                            <div className="label-icon-wrapper">
                                <span className="label-icon">👥</span>
                                <div className="icon-pulse"></div>
                            </div>
                            <span className="label-text">Gender Preference</span>
                            <div className="label-underline"></div>
                        </label>
                        <div className="gender-options">
                            {[
                                { value: "", label: "All", icon: "🏠", color: "var(--accent-color)" },
                                { value: "boy", label: "Boys", icon: "👨", color: "#4A90E2" },
                                { value: "girl", label: "Girls", icon: "👩", color: "#E24A90" },
                                { value: "unisex", label: "Unisex", icon: "👫", color: "#9B59B6" }
                            ].map((option, index) => (
                                <button
                                    key={option.value}
                                    className={`gender-option ${gender === option.value ? 'active' : ''}`}
                                    onClick={() => setGender(option.value)}
                                    style={{ '--option-color': option.color, '--animation-delay': `${0.1 * index}s` }}
                                >
                                    <div className="option-content">
                                        <span className="option-icon">{option.icon}</span>
                                        <span className="option-text">{option.label}</span>
                                        <div className="option-ripple"></div>
                                        <div className="option-glow"></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Amenities Section */}
                    <div className="filter-section amenities-section" data-animation-delay="0.3s">
                        <div className="amenities-header">
                            <label className="filter-label">
                                <div className="label-icon-wrapper">
                                    <span className="label-icon">⭐</span>
                                    <div className="icon-pulse"></div>
                                </div>
                                <span className="label-text">Amenities</span>
                                <div className="label-underline"></div>
                            </label>
                            {amenities.length > 0 && (
                                <button
                                    className="amenities-clear-btn"
                                    onClick={() => {
                                        setAmenities([]);
                                        setFilterAnimation(true);
                                        setTimeout(() => setFilterAnimation(false), 300);
                                    }}
                                    title="Clear all amenities"
                                >
                                    <div className="btn-content">
                                        <span className="btn-icon">🗑️</span>
                                        <span className="btn-text">Clear All</span>
                                        <div className="btn-ripple"></div>
                                    </div>
                                </button>
                            )}
                        </div>
                        <div className="amenities-grid">
                            {amenityOptions.map((amenity, index) => (
                                <label
                                    key={amenity.name}
                                    className={`amenity-option ${amenities.includes(amenity.name) ? 'active' : ''}`}
                                    style={{ '--animation-delay': `${0.05 * index}s` }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={amenities.includes(amenity.name)}
                                        onChange={() => handleAmenityChange(amenity.name)}
                                        className="amenity-checkbox"
                                    />
                                    <div className="amenity-content">
                                        <div className="amenity-icon-wrapper">
                                            <span className="amenity-icon">{amenity.icon}</span>
                                            <div className="amenity-icon-glow"></div>
                                        </div>
                                        <span className="amenity-text">{amenity.name}</span>
                                        <div className="amenity-check">
                                            <span className="check-icon">✓</span>
                                            <div className="check-ripple"></div>
                                        </div>
                                        <div className="amenity-border-glow"></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Filter Actions */}
            <div className="filter-actions">
                <div className="filter-status">
                    {hasActiveFilters && (
                        <div className="active-filters-badge">
                            <div className="badge-content">
                                <span className="badge-icon">🎯</span>
                                <span className="active-filters-count">
                                    {[
                                        priceRange.min || priceRange.max ? 1 : 0,
                                        gender ? 1 : 0,
                                        amenities.length
                                    ].reduce((a, b) => a + b, 0)} filters active
                                </span>
                                <div className="badge-glow"></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="action-buttons">
                    <button
                        className="apply-btn gradient enhanced"
                        onClick={applyFilters}
                    >
                        <div className="btn-content">
                            <span className="btn-icon">🔍</span>
                            <span className="btn-text">Apply Filters</span>
                            <div className="btn-shine"></div>
                            <div className="btn-ripple"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBox;
