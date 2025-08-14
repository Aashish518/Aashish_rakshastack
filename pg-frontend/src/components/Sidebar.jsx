import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            label: "Profile",
            path: "/profile",
            icon: "👤",
            description: "Manage your account"
        },
        {
            label: "Owner Dashboard",
            path: "/owner-dashboard",
            icon: "🏢",
            description: "Manage your PGs"
        },
        {
            label: "Saved PG",
            path: "/saved-pg",
            icon: "💖",
            description: "Your favorite PGs"
        },
    ];

    // Auto-collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleItemClick = (path) => {
        navigate(path);
        // Auto-collapse on mobile after navigation
        if (window.innerWidth <= 768) {
            setIsCollapsed(true);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle sidebar"
            >
                <span className="toggle-icon">
                    {isCollapsed ? '☰' : '✕'}
                </span>
            </button>

            {/* Sidebar */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} reveal`}>
                <div className="sidebar-background">
                    <div className="sidebar-orb orb-1"></div>
                    <div className="sidebar-orb orb-2"></div>
                </div>

                <div className="sidebar-content">
                    {/* Header */}
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            <span className="logo-icon">🏠</span>
                            {!isCollapsed && (
                                <div className="logo-text">
                                    <h2 className="sidebar-title">PG Finder</h2>
                                    <p className="sidebar-subtitle">Dashboard</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="sidebar-nav">
                        <ul className="sidebar-list">
                            {menuItems.map((item, index) => {
                                const active = location.pathname === item.path || location.pathname.startsWith(item.path);
                                return (
                                    <li
                                        key={item.path}
                                        className={`sidebar-item ${active ? 'active' : ''}`}
                                        onClick={() => handleItemClick(item.path)}

                                        aria-current={active ? "page" : undefined}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="item-content">
                                            <span className="item-icon">{item.icon}</span>
                                            {!isCollapsed && (
                                                <div className="item-text">
                                                    <span className="item-label">{item.label}</span>
                                                    <span className="item-description">{item.description}</span>
                                                </div>
                                            )}
                                        </div>

                                        {active && <div className="active-indicator"></div>}

                                        {/* Tooltip for collapsed state */}
                                        {isCollapsed && (
                                            <div className="item-tooltip">
                                                <span className="tooltip-label">{item.label}</span>
                                                <span className="tooltip-description">{item.description}</span>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer */}
                    {!isCollapsed && (
                        <div className="sidebar-footer">
                            <div className="footer-content">
                                <span className="footer-icon">✨</span>
                                <div className="footer-text">
                                    <span className="footer-title">Welcome!</span>
                                    <span className="footer-subtitle">Manage your PGs</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Overlay for mobile */}
            {!isCollapsed && window.innerWidth <= 768 && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsCollapsed(true)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
