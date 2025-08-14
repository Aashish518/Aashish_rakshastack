import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
    const token = localStorage.getItem("authToken");
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("navbar-theme") === "dark");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const theme = darkMode ? "dark" : "light";
        localStorage.setItem("navbar-theme", theme);
        document.documentElement.setAttribute("data-theme", theme); // 👈 global theme
    }, [darkMode]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
            setScrollProgress(progress);
            setIsScrolled(scrollTop > 50);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('mobile-menu-open');
        };
    }, [isMobileMenuOpen]);


    const handlelogin = () => {
        navigate("/login");
    }

    const links = [
        { label: "Home", path: "/" },
        { label: "PG List", path: "/pg-listing" },
        ...(token ? [{ label: "Profile", path: "/profile" }] : []),
    ];

    return (
        <nav className={`Navbar ${darkMode ? "Navbar-dark" : "Navbar-light"} ${isScrolled ? "scrolled" : ""}`}>
            {/* Background Effects */}
            <div className="navbar-background">
                <div className="navbar-orb orb-1"></div>
                <div className="navbar-orb orb-2"></div>
            </div>

            {/* Logo Section */}
            <div className="navbar-brand" onClick={() => navigate("/")}>
                <div className="brand-icon">🏠</div>
                <div className="brand-text">
                    <span className="brand-title">PG Finder</span>
                    <span className="brand-subtitle">Find Your Home</span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <ul className="Navbar-links desktop-nav">
                {links.map((link, index) => {
                    const isActive = location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path));
                    return (
                        <li
                            key={link.path}
                            className={`nav-item ${isActive ? "active" : ""}`}
                            onClick={() => navigate(link.path)}
                            aria-current={isActive ? "page" : undefined}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <span className="nav-text">{link.label}</span>
                            {isActive && <div className="active-dot"></div>}
                        </li>
                    );
                })}
                {!token && (
                    <li className="nav-item cta-item">
                        <button className="nav-cta gradient" onClick={handlelogin}>
                            <span className="cta-icon">🚀</span>
                            <span className="cta-text">Login</span>
                        </button>
                    </li>
                )}
            </ul>

            {/* Controls Section */}
            <div className="navbar-controls">
                {/* Theme Toggle */}
                <button
                    className="theme-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle theme"
                >
                    <div className="toggle-track">
                        <div className={`toggle-thumb ${darkMode ? "dark" : "light"}`}>
                            <span className="toggle-icon">
                                {darkMode ? "🌙" : "☀️"}
                            </span>
                        </div>
                    </div>
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    className={`mobile-menu-toggle ${isMobileMenuOpen ? "open" : ""}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="mobile-nav-content">
                    {links.map((link, index) => {
                        const isActive = location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path));
                        return (
                            <div
                                key={link.path}
                                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                                onClick={() => {
                                    navigate(link.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="mobile-nav-text">{link.label}</span>
                                {isActive && <div className="mobile-active-indicator"></div>}
                            </div>
                        );
                    })}

                    {/* Mobile Theme Toggle */}
                    <div className="mobile-theme-toggle" style={{ animationDelay: `${links.length * 100}ms` }}>
                        <span className="mobile-theme-label">
                            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                        </span>
                        <button
                            className="theme-toggle"
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label="Toggle theme"
                        >
                            <div className="toggle-track">
                                <div className={`toggle-thumb ${darkMode ? "dark" : "light"}`}>
                                    <span className="toggle-icon">
                                        {darkMode ? "🌙" : "☀️"}
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>

                    {!token && (
                        <button
                            className="mobile-cta gradient"
                            onClick={() => {
                                handlelogin();
                                setIsMobileMenuOpen(false);
                            }}
                            style={{ animationDelay: `${(links.length + 1) * 100}ms` }}
                        >
                            <span className="mobile-cta-icon">🚀</span>
                            <span className="mobile-cta-text">Login</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className={`mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Progress Bar */}
            <div className="Navbar-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
        </nav>
    );
};

export default Navbar;
