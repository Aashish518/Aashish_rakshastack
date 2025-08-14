import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

const FooterComp = () => {
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { label: "Facebook", url: "https://facebook.com", icon: "📘" },
        { label: "Twitter", url: "https://twitter.com", icon: "🐦" },
        { label: "Instagram", url: "https://instagram.com", icon: "📷" },
        { label: "LinkedIn", url: "https://linkedin.com", icon: "💼" }
    ];

    const contactInfo = [
        { label: "Address", value: "123, PG Street, Your City", icon: "📍" },
        { label: "Phone", value: "+91 9876543210", icon: "📞" },
        { label: "Email", value: "info@pgfinder.com", icon: "✉️" },
        { label: "Hours", value: "24/7 Support", icon: "🕒" }
    ];

    return (
        <footer className="footercomp-container">
            {/* Background Effects */}
            <div className="footer-background">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
            </div>

            {/* CTA Section */}
            <div className="footercomp-cta reveal">
                <div className="cta-content">
                    <div className="cta-icon">🚀</div>
                    <div className="cta-text">
                        <h3 className="footercomp-cta-title">Ready to find your perfect PG?</h3>
                        <p className="cta-subtitle">Join thousands of happy residents</p>
                    </div>
                </div>
                <div className="cta-actions">
                    <button
                        className="footer-btn primary gradient"
                        onClick={() => navigate('/pg-listing')}
                    >
                        <span className="btn-icon">🔍</span>
                        <span className="btn-text">Explore PGs</span>
                    </button>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="footercomp-content">
                {/* Brand Section */}
                <div className="footercomp-section brand-section reveal">
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <span className="logo-icon">🏠</span>
                            <span className="logo-text">PG Finder</span>
                        </div>
                        <p className="brand-description">
                            Your trusted partner in finding the perfect PG accommodation.
                            We connect students and professionals with quality living spaces.
                        </p>
                        <div className="brand-stats">
                            <div className="stat-item">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Happy Residents</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">PG Partners</span>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Contact Info */}
                <div className="footercomp-section reveal delay-1">
                    <h3 className="footercomp-heading">
                        <span className="heading-icon">📞</span>
                        <span className="heading-text">Contact Info</span>
                    </h3>
                    <div className="contact-info">
                        {contactInfo.map((info, index) => (
                            <div
                                key={info.label}
                                className="contact-item"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="contact-icon">{info.icon}</span>
                                <div className="contact-content">
                                    <span className="contact-label">{info.label}</span>
                                    <span className="contact-value">{info.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links */}
                <div className="footercomp-section reveal delay-2">
                    <h3 className="footercomp-heading">
                        <span className="heading-icon">🌐</span>
                        <span className="heading-text">Follow Us</span>
                    </h3>
                    <div className="footercomp-socials">
                        {socialLinks.map((social, index) => (
                            <a
                                key={social.label}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="social-link"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="social-icon">{social.icon}</span>
                                <span className="social-text">{social.label}</span>
                                <span className="social-arrow">↗</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footercomp-bottom reveal delay-3">
                <div className="bottom-content">
                    <div className="copyright">
                        <span className="copyright-icon">©</span>
                        <span className="copyright-text">
                            {currentYear} PG Finder. All rights reserved.
                        </span>
                    </div>
                    <div className="bottom-links">
                        <a href="/privacy" className="bottom-link">Privacy Policy</a>
                        <span className="separator">•</span>
                        <a href="/terms" className="bottom-link">Terms of Service</a>
                        <span className="separator">•</span>
                        <a href="/support" className="bottom-link">Support</a>
                    </div>
                </div>
                <div className="footer-heart">
                    <span className="heart-text">Made with</span>
                    <span className="heart-icon">❤️</span>
                    <span className="heart-text">for students</span>
                </div>
            </div>
        </footer>
    );
};

export default FooterComp;
