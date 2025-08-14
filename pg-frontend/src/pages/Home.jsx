import { useEffect, useState } from "react";
import FooterComp from "../components/Footer";
import Navbar from "../components/Navbar";
import SearchBar from "../components/Searchbar";
import axios from "axios";
import PGCard from "../components/Pgcard";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";


const HomePage = () => {
    const [search, setSearch] = useState("");
    const [pgs, setPgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchpg();
    }, [search]);

    const fetchpg = async () => {
        try {
            setIsLoading(true);
            const params = { search };
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/pg-listings`, { params });
            if (res.data.pgs) {
                const randomThree = [...res.data.pgs]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                setPgs(randomThree);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="home-page">
                {/* Enhanced Hero Section */}
                <section className="hero">
                    <div className="hero-background" aria-hidden="true">
                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                        <div className="floating-orb orb-3"></div>
                        <div className="hero-pattern"></div>
                    </div>

                    <div className="hero-content">

                        <h1 className="hero-title fade-in delay-1">
                            <span className="title-line">Find Your Perfect</span>
                            <span className="title-highlight">PG Home</span>
                        </h1>

                        <p className="hero-subtitle fade-in delay-2">
                            Discover comfortable and affordable PGs near you with modern amenities,
                            verified listings, and instant booking options.
                        </p>

                        <div className="hero-stats fade-in delay-3">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Verified PGs</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Locations</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Happy Residents</span>
                            </div>
                        </div>

                        <div className="search-wrapper fade-in delay-4">
                            <div className="search-container">
                                <SearchBar onSearch={setSearch} />
                                <div className="search-suggestions">
                                    <span className="suggestion-label">Popular:</span>
                                    <button className="suggestion-tag" onClick={() => setSearch("Koramangala")}>
                                        Koramangala
                                    </button>
                                    <button className="suggestion-tag" onClick={() => setSearch("Whitefield")}>
                                        Whitefield
                                    </button>
                                    <button className="suggestion-tag" onClick={() => setSearch("HSR Layout")}>
                                        HSR Layout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section fade-in delay-5">
                    <div className="features-container">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3 className="feature-title">Smart Search</h3>
                            <p className="feature-description">Find PGs with advanced filters and location-based search</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h3 className="feature-title">Verified Listings</h3>
                            <p className="feature-description">All PGs are verified with authentic photos and details</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📞</div>
                            <h3 className="feature-title">Direct Contact</h3>
                            <p className="feature-description">Connect directly with PG owners for inquiries and visits</p>
                        </div>
                    </div>
                </section>

                {/* Enhanced Recommendations Section */}
                <section className="home-recommendations">
                    <div className="section-header fade-in delay-6">
                        <div className="header-content">
                            <h2 className="section-title">
                                <span className="title-icon">⭐</span>
                                <span className="title-text">Recommended for You</span>
                            </h2>
                            <p className="section-subtitle">
                                Handpicked PGs based on your preferences and location
                            </p>
                        </div>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate('/pg-listing')}
                        >
                            <span className="btn-text">View All</span>
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>

                    <div className="card-grid">
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                  <div className="skeleton-card enhanced-skeleton" key={`skeleton-${index}`}>
                                      <div className="skeleton-img">
                                          <div className="skeleton-shimmer"></div>
                                      </div>
                                      <div className="skeleton-body">
                                          <div className="skeleton-line w-80" />
                                          <div className="skeleton-line w-60" />
                                          <div className="skeleton-badges">
                                              <span className="skeleton-pill" />
                                              <span className="skeleton-pill" />
                                          </div>
                                          <div className="skeleton-actions">
                                              <span className="skeleton-btn primary" />
                                              <span className="skeleton-btn secondary" />
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : pgs.map((pg, index) => (
                                  <div
                                      className="card-animate enhanced-card"
                                      style={{ animationDelay: `${0.2 * index}s` }}
                                      key={pg._id}
                                  >
                                      <PGCard pg={pg} onViewDetail={(id) => navigate(`/pg-detail/${id}`)} />
                                  </div>
                              ))}
                    </div>

                    {!isLoading && pgs.length > 0 && (
                        <div className="cta-section fade-in delay-8">
                            <button
                                className="cta-button gradient-btn"
                                onClick={() => navigate('/pg-listing')}
                            >
                                <span className="btn-content">
                                    <span className="btn-icon">🏠</span>
                                    <span className="btn-text">Explore More PGs</span>
                                    <span className="btn-arrow">→</span>
                                </span>
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <FooterComp />
        </>
    );
}

export default HomePage;
