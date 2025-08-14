import { useEffect, useState } from "react";
import SearchBar from "../components/Searchbar";
import FilterBox from "../components/Filterbox";
import PGCard from "../components/Pgcard";
import "../styles/pglisting.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import FooterComp from "../components/Footer";

const PGListingPage = () => {
    const [pgs, setPgs] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const navigate = useNavigate();

    const fetchPGs = async () => {
        try {
            setIsLoading(true);
            const params = {
                search,
                page: currentPage,
                minPrice: filters.priceRange?.min,
                maxPrice: filters.priceRange?.max,
                gender: filters.gender,
                amenities: filters.amenities?.join(",")
            };
            console.log(params.amenities)

            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/pg-listings`, { params });
            setPgs(res.data.pgs);
            setTotalPages(res.data.totalPages);
            setTotalResults(res.data.totalResults);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search or filters change
    }, [search, filters]);

    useEffect(() => {
        fetchPGs();
    }, [currentPage, search, filters]);
    
    return (
        <>
            <Navbar/>
            <div className="pg-listing-page">
                {/* Hero Section */}
                <div className="pg-listing-hero">
                    <div className="hero-background">
                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                        <div className="floating-orb orb-3"></div>
                    </div>
                    <div className="hero-content reveal">
                        <div className="hero-icon">🏠</div>
                        <h1 className="pg-listing-title">Discover Perfect PGs</h1>
                        <p className="pg-listing-subtitle">Find your ideal accommodation with advanced search and filters</p>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="pg-controls-section">
                    <div className="controls-header reveal delay-1">
                        <h2 className="controls-title">🔍 Search & Filter</h2>
                        <p className="controls-description">Use our advanced tools to find exactly what you're looking for</p>
                    </div>

                    <div className="pg-controls reveal delay-2">
                        <SearchBar onSearch={setSearch} />
                        <FilterBox onFilter={setFilters} />
                    </div>

                    {/* View Controls */}
                    <div className="view-controls reveal delay-3">
                        <div className="view-options">
                            <button
                                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                                onClick={() => setViewMode("grid")}
                            >
                                <span className="view-icon">⊞</span>
                                <span className="view-text">Grid</span>
                            </button>
                            <button
                                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                                onClick={() => setViewMode("list")}
                            >
                                <span className="view-icon">☰</span>
                                <span className="view-text">List</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="pg-results-section">
                    <div className="results-header reveal delay-4">
                        <h2 className="results-title">📋 Available PGs</h2>
                        <div className="results-info">
                            {!isLoading && totalResults > 0 && (
                                <span className="results-count">
                                    Showing {pgs.length} of {totalResults} results
                                </span>
                            )}
                        </div>
                    </div>

                    <section className={`pg-grid ${viewMode === "list" ? "list-view" : "grid-view"}`}>
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                  <div className="skeleton-card" key={`s-${i}`}>
                                      <div className="skeleton-img" />
                                      <div className="skeleton-body">
                                          <div className="skeleton-line w-80" />
                                          <div className="skeleton-line w-60" />
                                          <div className="skeleton-badges">
                                              <span className="skeleton-pill" />
                                              <span className="skeleton-pill" />
                                          </div>
                                          <div className="skeleton-actions">
                                              <span className="skeleton-btn" />
                                              <span className="skeleton-btn ghost" />
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : pgs.length === 0 ? (
                                <div className="empty-state reveal delay-5">
                                    <div className="empty-icon">🔍</div>
                                    <h3 className="empty-title">No PGs Found</h3>
                                    <p className="empty-description">
                                        Try adjusting your search criteria or filters to find more results.
                                    </p>
                                    <button
                                        className="empty-action-btn"
                                        onClick={() => {
                                            setSearch("");
                                            setFilters({});
                                        }}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                pgs.map((pg, index) => (
                                    <div
                                        className="card-animate pg-card-wrapper"
                                        style={{ animationDelay: `${0.1 * index}s` }}
                                        key={pg._id}
                                    >
                                        <PGCard pg={pg} onViewDetail={(id) => navigate(`/pg-detail/${id}`)} />
                                    </div>
                                ))
                            )}
                    </section>

                    {/* Pagination */}
                    {!isLoading && pgs.length > 0 && totalPages > 1 && (
                        <div className="pagination-section reveal delay-6">
                            <div className="pagination-container">
                                <button
                                    className="pagination-btn prev-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <span className="pagination-icon">←</span>
                                    <span className="pagination-text">Previous</span>
                                </button>

                                <div className="pagination-numbers">
                                    {(() => {
                                        const pages = [];
                                        const maxVisiblePages = 5;
                                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                        if (endPage - startPage + 1 < maxVisiblePages) {
                                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                        }

                                        // First page
                                        if (startPage > 1) {
                                            pages.push(
                                                <button
                                                    key={1}
                                                    className="pagination-number"
                                                    onClick={() => handlePageChange(1)}
                                                >
                                                    1
                                                </button>
                                            );
                                            if (startPage > 2) {
                                                pages.push(
                                                    <span key="start-ellipsis" className="pagination-ellipsis">
                                                        ...
                                                    </span>
                                                );
                                            }
                                        }

                                        // Visible pages
                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    className={`pagination-number ${i === currentPage ? 'active' : ''}`}
                                                    onClick={() => handlePageChange(i)}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }

                                        // Last page
                                        if (endPage < totalPages) {
                                            if (endPage < totalPages - 1) {
                                                pages.push(
                                                    <span key="end-ellipsis" className="pagination-ellipsis">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            pages.push(
                                                <button
                                                    key={totalPages}
                                                    className="pagination-number"
                                                    onClick={() => handlePageChange(totalPages)}
                                                >
                                                    {totalPages}
                                                </button>
                                            );
                                        }

                                        return pages;
                                    })()}
                                </div>

                                <button
                                    className="pagination-btn next-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="pagination-text">Next</span>
                                    <span className="pagination-icon">→</span>
                                </button>
                            </div>

                            <div className="pagination-info">
                                <span className="pagination-info-text">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FooterComp/>
        </>
    );
};

export default PGListingPage;
