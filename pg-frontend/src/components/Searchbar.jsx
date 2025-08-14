import { useState, useRef, useEffect } from "react";
import "../styles/searchbar.css";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Mock suggestions - in real app, these would come from API
    const mockSuggestions = [
        { text: "Mumbai", type: "location", icon: "📍" },
        { text: "Delhi", type: "location", icon: "📍" },
        { text: "Bangalore", type: "location", icon: "📍" },
        { text: "Pune", type: "location", icon: "📍" },
        { text: "Boys PG", type: "category", icon: "👨" },
        { text: "Girls PG", type: "category", icon: "👩" },
        { text: "Furnished PG", type: "amenity", icon: "🏠" },
        { text: "AC Rooms", type: "amenity", icon: "❄️" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsSearching(true);
            onSearch(searchTerm.trim());
            setShowSuggestions(false);

            // Simulate search delay
            setTimeout(() => {
                setIsSearching(false);
            }, 1000);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Show suggestions after typing
        if (value.length > 0) {
            const filtered = mockSuggestions.filter(suggestion =>
                suggestion.text.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);

            // Auto-search after delay
            searchTimeoutRef.current = setTimeout(() => {
                if (value.trim()) {
                    onSearch(value.trim());
                }
            }, 500);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.text);
        setShowSuggestions(false);
        onSearch(suggestion.text);
        inputRef.current?.focus();
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSuggestions([]);
        setShowSuggestions(false);
        onSearch("");
        inputRef.current?.focus();
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.closest('.searchbar-container').contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="searchbar-container">
            <form className={`searchbar ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
                {/* Search Icon */}
                <div className="search-icon">
                    <span className="icon">🔍</span>
                </div>

                {/* Input Field */}
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search by name or location"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="search-input"
                        autoComplete="off"
                    />

                    {/* Clear Button */}
                    {searchTerm && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={clearSearch}
                            aria-label="Clear search"
                        >
                            <span className="clear-icon">✕</span>
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className={`search-btn ${isSearching ? 'searching' : ''}`}
                    disabled={isSearching}
                >
                    <span className="btn-content">
                        {isSearching ? (
                            <>
                                <span className="loading-spinner"></span>
                                <span className="btn-text">Searching...</span>
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">🚀</span>
                                <span className="btn-text">Search</span>
                            </>
                        )}
                    </span>
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    <div className="suggestions-header">
                        <span className="suggestions-title">💡 Suggestions</span>
                        <span className="suggestions-count">{suggestions.length} found</span>
                    </div>
                    <div className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className="suggestion-icon">{suggestion.icon}</span>
                                <div className="suggestion-content">
                                    <span className="suggestion-text">{suggestion.text}</span>
                                    <span className="suggestion-type">{suggestion.type}</span>
                                </div>
                                <span className="suggestion-arrow">→</span>
                            </button>
                        ))}
                    </div>
                    <div className="suggestions-footer">
                        <span className="suggestions-tip">💡 Tip: Press Enter to search or click a suggestion</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
